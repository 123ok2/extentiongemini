/**
 * Gemini & ChatGPT Study Exporter - Service Worker (Background) v2.2
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('[StudyExporter] Tiện ích đã cài đặt thành công!');

  // Tự động tiêm content script vào tất cả các tab Gemini và ChatGPT đang mở
  chrome.tabs.query({ url: ['https://gemini.google.com/*', 'https://chatgpt.com/*', 'https://chat.openai.com/*'] }, (tabs) => {
    if (tabs && tabs.length > 0) {
      tabs.forEach(tab => {
        if (tab.id) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          }).catch(err => console.log('Không thể tiêm tab:', tab.id, err));

          chrome.scripting.insertCSS({
            target: { tabId: tab.id },
            files: ['content.css']
          }).catch(err => console.log('Không thể tiêm CSS:', tab.id, err));
        }
      });
    }
  });

  // Tạo Context Menu khi người dùng bôi đen văn bản
  chrome.contextMenus.create({
    id: 'export-selected-math-pdf',
    title: 'Tải đoạn bôi đen này thành PDF (Giữ nguyên công thức)',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'export-selected-math-word',
    title: 'Tải đoạn bôi đen này thành Word (.doc)',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'export-selected-math-md',
    title: 'Tải đoạn bôi đen này thành Markdown (.md)',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab || !tab.id) return;

  let format = 'pdf';
  if (info.menuItemId === 'export-selected-math-word') format = 'word';
  if (info.menuItemId === 'export-selected-math-md') format = 'md';

  chrome.tabs.sendMessage(tab.id, {
    action: 'EXPORT_SELECTION',
    text: info.selectionText,
    format: format
  });
});
