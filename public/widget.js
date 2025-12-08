/**
 * Trainly Chat Widget
 * Embeddable chat widget script
 *
 * Usage:
 * <script src="https://YOUR_DOMAIN/widget.js" defer></script>
 */

(function() {
  'use strict';

  // Configuration - automatically detect the script's origin
  var scriptTag = document.currentScript;
  var scriptSrc = scriptTag ? scriptTag.src : '';
  var baseUrl = scriptSrc ? new URL(scriptSrc).origin : window.TRAINLY_WIDGET_URL || '';

  if (!baseUrl) {
    console.error('[Trainly Widget] Could not determine widget URL. Please set window.TRAINLY_WIDGET_URL before loading the script.');
    return;
  }

  // Prevent multiple initializations
  if (window.TrainlyWidgetLoaded) {
    return;
  }
  window.TrainlyWidgetLoaded = true;

  // Create and inject styles
  var styles = document.createElement('style');
  styles.textContent = [
    '#trainly-widget-container {',
    '  position: fixed;',
    '  bottom: 0;',
    '  right: 0;',
    '  width: 420px;',
    '  height: 580px;',
    '  z-index: 2147483647;',
    '  pointer-events: none;',
    '}',
    '#trainly-widget-container iframe {',
    '  width: 100%;',
    '  height: 100%;',
    '  border: none;',
    '  background: transparent;',
    '  pointer-events: auto;',
    '}',
    '@media (max-width: 480px) {',
    '  #trainly-widget-container {',
    '    width: 100%;',
    '    height: 100%;',
    '    bottom: 0;',
    '    right: 0;',
    '  }',
    '}'
  ].join('\n');
  document.head.appendChild(styles);

  // Create container
  var container = document.createElement('div');
  container.id = 'trainly-widget-container';

  // Create iframe
  var iframe = document.createElement('iframe');
  iframe.src = baseUrl + '/embed';
  iframe.title = 'Chat Widget';
  iframe.allow = 'clipboard-write';
  iframe.setAttribute('loading', 'lazy');

  // Append to DOM
  container.appendChild(iframe);
  document.body.appendChild(container);

  // Listen for messages from the iframe
  window.addEventListener('message', function(event) {
    // Verify origin
    if (event.origin !== baseUrl) {
      return;
    }

    var data = event.data;

    if (data.type === 'TRAINLY_STATE') {
      // Handle state changes from widget
      if (data.isMinimized) {
        container.style.pointerEvents = 'none';
      } else {
        container.style.pointerEvents = 'auto';
      }
    }
  });

  // Expose API for programmatic control
  window.TrainlyWidget = {
    open: function() {
      iframe.contentWindow.postMessage({ type: 'TRAINLY_OPEN' }, baseUrl);
    },
    close: function() {
      iframe.contentWindow.postMessage({ type: 'TRAINLY_CLOSE' }, baseUrl);
    },
    toggle: function() {
      iframe.contentWindow.postMessage({ type: 'TRAINLY_TOGGLE' }, baseUrl);
    }
  };
})();

