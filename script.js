document.getElementById('top-text-input').addEventListener('input', function () {
  document.getElementById('top-text').textContent = this.value;
});

document.getElementById('bottom-text-input').addEventListener('input', function () {
  document.getElementById('bottom-text').textContent = this.value;
});
