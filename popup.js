document.addEventListener('DOMContentLoaded', function() {
  // Initialize CodeMirror
  const editor = CodeMirror.fromTextArea(document.getElementById('code'), {
    mode: 'javascript',
    theme: 'dracula',
    lineNumbers: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    indentUnit: 2,
    tabSize: 2,
    lineWrapping: true,
    autofocus: true
  });

  const outputDiv = document.getElementById('output');
  const outputStatus = document.getElementById('outputStatus');
  const runButton = document.getElementById('runButton');
  const clearButton = document.getElementById('clearButton');

  // Create sandbox iframe
  const sandbox = document.createElement('iframe');
  sandbox.src = 'sandbox.html';
  sandbox.style.display = 'none';
  document.body.appendChild(sandbox);

  function updateStatus(success, message) {
    outputStatus.innerHTML = `
      <div class="status-dot"></div>
      <span>${message}</span>
    `;
    outputStatus.className = `status ${success ? '' : 'status-error'}`;
  }

  // Handle messages from sandbox
  window.addEventListener('message', function(event) {
    if (event.data.error) {
      outputDiv.textContent = event.data.error;
      updateStatus(false, 'Error occurred');
    } else {
      outputDiv.textContent = event.data.result || 'No output';
      updateStatus(true, 'Executed successfully');
    }
  });

  // Run button click handler
  runButton.addEventListener('click', function() {
    const code = editor.getValue();
    outputDiv.textContent = 'Running...';
    updateStatus(true, 'Executing...');
    sandbox.contentWindow.postMessage(code, '*');
  });

  // Clear button click handler
  clearButton.addEventListener('click', function() {
    editor.setValue('');
    outputDiv.textContent = '// Output will appear here...';
    updateStatus(true, 'Ready');
    editor.focus();
  });

  // Initialize with default status
  updateStatus(true, 'Ready');
});