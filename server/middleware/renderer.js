import { Helmet } from 'react-helmet';
import ReactDOMServer from 'react-dom/server';
import { ChunkExtractor } from '@loadable/server';
import { getDataFromTree } from '@apollo/react-ssr';
import { has, get } from 'lodash';
import path from 'path';
import fs from 'fs';
import uglify from 'uglifycss';
import { AppRegistry } from 'react-native';
import stats from '../loadable-stats.json';
import getUrl from '../../src/utils/getUrl';
import routes from '../../src/screens/routes';
import { createClient, INITIAL_STATE } from '../../src/utils/apollo';
import App from '../App';

const re = /^https?:\/\//;
const reTest = /\?test$/;
const reStyle = /(<\/?style[^>]*>|\*display: ?inline;| ?!important)/g;
const reAmphtml = /<link data-react-helmet="true" rel="amphtml" href="([^"]+)"\/>/g;
const reFixAmpInputs = /(autoCapitalize|autoCorrect)(="[^"]+")?/g;
const reRandomStyle = /<style(>| [^>]*>)([^<]+)<\/style>/g;
const rePreload = /<link data-react-helmet="true" rel="preload"[^>]+>/g;
const reBind = /data-amp-([a-z]+)="([^"]+)"/g;
const reScriptSrc = /src="([^"]+)"/g;
const reSchemaOrg = /<script [^>]*type="application\/ld\+json">(.*?)<\/script>/g;
const reAmpScripts = /<script async[^>]*>(.*?)<\/script>/g;

const publicPath = process.env.PUBLIC_URL || '/';

const notFound = /\/404\/?$/;

const SSR_MODE = true;

const testHTML = `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width,height=device-height">
    </head>
    <body>
      Hello world!
    </body>
  </html>
`;
function getTestHtml() {
  try {
    return fs.readFileSync(path.resolve(__dirname, '..', 'test.html')).toString();
  } catch (err) {
    return testHTML;
  }
}

const indexHTML = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'))
  .toString()
  .replace('https://divin2sy6ce0b.cloudfront.net/build/manifest.json', '/manifest.json')
  .replace(/<script src="[^"]*\/static\/js\/[^"]+">.*<\/script>/, '')

  // We are currently not using Adroll.
  .replace(/<script type="text\/javascript">adroll_adv_id=[^<]+<\/script>/, '');

const ampHTML = indexHTML
  .replace('<html ', '<html amp ')
  .replace('</head>', '<script async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script><script async custom-element="amp-list" src="https://cdn.ampproject.org/v0/amp-list-0.1.js"></script><script async custom-template="amp-mustache" src="https://cdn.ampproject.org/v0/amp-mustache-0.2.js"></script></head>')
  .replace(/<script>!.*<\/script>/, '')
  .replace(/<script async src="https:\/\/www\.googletagmanager\.com\/gtag[^<]+<\/script>/, '')
  .replace(
    /<script>function gtag\(\)\{[^<]+<\/script>/,
    `<amp-analytics type="gtag" data-credentials="include"><script type="application/json">{"vars":{"gtag_id":"${process.env.REACT_APP_GOOGLE_ANALYTICS_ID}","config":{"${process.env.REACT_APP_GOOGLE_ANALYTICS_ID}":{"groups":"default"}}}}</script></amp-analytics>`,
  )
  .replace(/<script type="text\/javascript">adroll_adv_id=[^<]+<\/script>/, '')
  .replace(',target-densitydpi=device-dpi', '');

const loadCSS = '<script>!function(e){"use strict";var t=function(t,n,r,o){var i,a=e.document,d=a.createElement("link");if(n)i=n;else{var f=(a.body||a.getElementsByTagName("head")[0]).childNodes;i=f[f.length-1]}var l=a.styleSheets;if(o)for(var s in o)o.hasOwnProperty(s)&&d.setAttribute(s,o[s]);d.rel="stylesheet",d.href=t,d.media="only x",function e(t){if(a.body)return t();setTimeout(function(){e(t)})}(function(){i.parentNode.insertBefore(d,n?i:i.nextSibling)});var u=function(e){for(var t=d.href,n=l.length;n--;)if(l[n].href===t)return e();setTimeout(function(){u(e)})};function c(){d.addEventListener&&d.removeEventListener("load",c),d.media=r||"all"}return d.addEventListener&&d.addEventListener("load",c),d.onloadcssdefined=u,u(c),d};"undefined"!=typeof exports?exports.loadCSS=t:e.loadCSS=t}("undefined"!=typeof global?global:this);</script>';

AppRegistry.registerComponent('App', () => App);

const render = reactComponent => new Promise((resolve, reject) => {
  const body = [];
  const bodyStream = ReactDOMServer.renderToNodeStream(reactComponent);
  bodyStream.on('data', (chunk) => {
    body.push(chunk.toString());
  });
  bodyStream.on('error', (err) => {
    reject(err);
  });
  bodyStream.on('end', () => {
    resolve(body.join(''));
  });
});

const renderer = () => async (ctx) => {
  let url = ctx.req.url.replace(re, '');
  url = url.substring(url.indexOf('/'));

  // It's time consuming to do `yarn web:server`
  // every time to test AMP changes (specially small HTML/CSS tweaks).
  // Instead, we can set the env AMP_TEST=1 and add the html
  // to ../test.html. Run `yarn web:server:run` and access /test.
  if (parseInt(process.env.AMP_TEST, 10)) {
    ctx.body = getTestHtml();
    return null;
  }

  const context = {};
  const client = createClient(SSR_MODE, Object.assign({}, INITIAL_STATE), ctx.request.ip);
  const initialProps = {
    client,
    url,
    context,
  };

  const { element, getStyleElement } = AppRegistry.getApplication(
    'App',
    { initialProps },
  );

  const chunkExtractor = new ChunkExtractor({
    stats: { ...stats },
    publicPath,
  });

  const jsx = chunkExtractor.collectChunks(element);

  try {
    await getDataFromTree(jsx);
  } catch (err) {
    if (err.networkError || !get(err, 'graphQLErrors[0].code')) {
      ctx.status = 500;
      return ctx.redirect(getUrl('/500'));
    }
    ctx.status = 404;
    return ctx.redirect(getUrl('/404'));
  }

  let body = await render(jsx);
  const initialState = client.extract();

  if (has(initialState, 'cacheControl')) {
    ctx.set('Cache-Control', `max-age=${initialState.cacheControl}`);
  } else {
    ctx.set('Cache-Control', 'max-age=7200'); // 2 hours
  }
  ctx.set('Connection', 'close');

  if (context.url) {
    if (notFound.test(context.url)) {
      ctx.status = 404;
    }
    return ctx.redirect(context.url);
  }

  const helmet = Helmet.renderStatic();
  let css = ReactDOMServer.renderToStaticMarkup(getStyleElement()).replace(reStyle, '');
  body = body.replace(reRandomStyle, (match, __, content) => {
    css += content.replace(reStyle, '');
    return '';
  });
  const style = `${css}${helmet.style.toString().replace(reStyle, '')}`;

  let link = helmet.link.toString();
  const amp = routes.isAmp(url.split('#')[0].split('?')[0]);
  if (amp) {
    link = link.replace(reAmphtml, '');
  }

  const extraChunks = chunkExtractor.getScriptTags();

  let html = amp || reTest.test(url) ? ampHTML : indexHTML;
  html = html
    .replace(
      '<script id="__APOLLO_STATE__" type="application/json"></script>',
      amp ? '' : `<script id="__APOLLO_STATE__" type="application/json">${JSON.stringify(initialState).replace(/</g, '\\u003c')}</script>`,
    )
    .replace(
      '<script src="http://localhost:8097"></script>', // react-dev-tools
      '',
    )
    .replace(
      '</head>',
      `${helmet.title.toString()}${helmet.meta.toString()}${link}${helmet.script.toString()}</head>`,
    )
    .replace(
      '<style amp-custom></style>',
      `<style amp-custom>${uglify.processString(style)}</style>`,
    )
    .replace(
      '<div id="root">',
      `<div id="root">${body}`,
    );

  if (amp) {
    html = html.replace(reFixAmpInputs, '');
  }

  const externalCss = [];

  // Optimize fonts.
  if (html.indexOf('<link data-react-helmet="true" rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" type="text/css"/>') >= 0) {
    html = html.replace('<link data-react-helmet="true" rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" type="text/css"/>', '');

    if (amp) {
      // All fonts must be at the header for AMP therefore
      // we should preconnect to reduce blocking time.
      html = html.replace('<link rel="preload" as="script" href="https://cdn.ampproject.org/v0.js">', '<link rel="dns-prefetch preconnect" href="https://maxcdn.bootstrapcdn.com" crossorigin><link rel="preload" as="script" href="https://cdn.ampproject.org/v0.js">');
      html = html.replace('<style amp-boilerplate>', '<link data-react-helmet="true" rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" type="text/css"/><style amp-boilerplate>');
    } else {
      // Non AMP pages can load fonts asynchronously.
      externalCss.push('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    }
  }

  // Load external CSS asynchronously.
  if (externalCss.length) {
    html = html.replace('<div id="root">', `${loadCSS}<script>${externalCss.map(cssUrl => `loadCSS("${cssUrl}")`).join(';')}</script><div id="root">`);
  }

  // Add internal scripts before the external scripts.
  if (!amp) {
    html = html.replace(reAmpScripts, '');

    const extraScripts = extraChunks
      .replace(/\n/g, '')
      .replace(/<script async data-chunk="main" src="[^"]*\/static\/js\/runtime-main\.[^.]+\.js"><\/script>/, '');

    const scriptUrls = extraScripts.match(reScriptSrc);
    if (scriptUrls && scriptUrls.length) {
      const scriptPreloads = scriptUrls.map(scriptUrl => `<link rel="preload" as="script" href="${scriptUrl.replace(reScriptSrc, '$1')}">`).join('');
      html = html.replace('<link rel="preload" as="script" href="https://cdn.ampproject.org/v0.js">', `<link rel="preload" as="script" href="https://cdn.ampproject.org/v0.js">${scriptPreloads}`);
    }
    html = html.replace('<div id="root">', `${extraScripts}<div id="root">`);
  }

  // Push all preloads to the very top.
  const preloads = html.match(rePreload);
  if (preloads && preloads.length) {
    html = html.replace(rePreload, '');
    html = html.replace('<link rel="preload" as="script" href="https://cdn.ampproject.org/v0.js">', `${amp ? '<link rel="preload" as="script" href="https://cdn.ampproject.org/v0.js">' : ''}${preloads.join('')}`);
  }

  // Move all schema.org markup to the bottom
  const markups = html.match(reSchemaOrg);
  if (markups && markups.length) {
    html = html.replace(reSchemaOrg, '');
    html = html.replace('</body>', markups.join(''));
  }

  // For non-AMP pages, we display the content right away.
  if (!amp) {
    html = html.replace('<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>', '');
  } else {
    html = html.replace(reBind, '[$1]="$2"');
  }

  ctx.body = html;
  return null;
};

export default renderer;
