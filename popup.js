document.addEventListener('DOMContentLoaded', () => {
  let currentScope = 'all';

  const siteBadge = document.getElementById('site-badge');
  const totalMsgsEl = document.getElementById('total-msgs');
  const selectedMsgsEl = document.getElementById('selected-msgs');
  const scopeAllBtn = document.getElementById('scope-all');
  const scopeSelectedBtn = document.getElementById('scope-selected');
  const tipBox = document.getElementById('tip-box');
  const rescanBtn = document.getElementById('btn-rescan-tab');
  const reloadBtn = document.getElementById('btn-reload-tab');

  // Chuyển phạm vi tải
  scopeAllBtn.addEventListener('click', () => {
    currentScope = 'all';
    scopeAllBtn.classList.add('active');
    scopeSelectedBtn.classList.remove('active');
  });

  scopeSelectedBtn.addEventListener('click', () => {
    currentScope = 'selected';
    scopeSelectedBtn.classList.add('active');
    scopeAllBtn.classList.remove('active');
  });

  function updatePlatformBadge(url) {
    if (url.includes('gemini.google.com')) {
      siteBadge.className = 'badge badge-gemini';
      siteBadge.innerText = 'Google Gemini';
      return true;
    } else if (url.includes('chatgpt.com') || url.includes('chat.openai.com')) {
      siteBadge.className = 'badge badge-chatgpt';
      siteBadge.innerText = 'ChatGPT';
      return true;
    } else {
      siteBadge.className = 'badge badge-none';
      siteBadge.innerText = 'Không phát hiện chat AI';
      tipBox.innerHTML = '⚠️ Hãy chuyển sang tab <strong>gemini.google.com</strong> hoặc <strong>chatgpt.com</strong> để sử dụng.';
      return false;
    }
  }

  function queryTabInfo(tabId) {
    totalMsgsEl.innerText = 'Đang quét...';

    chrome.tabs.sendMessage(tabId, { action: 'GET_INFO' }, (response) => {
      if (chrome.runtime.lastError || !response) {
        // Tab chưa được tiêm script, tự động tiêm ngay lập tức
        if (chrome.scripting) {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
          }).then(() => {
            chrome.scripting.insertCSS({
              target: { tabId: tabId },
              files: ['content.css']
            }).catch(() => {});

            // Thử hỏi lại sau 350ms
            setTimeout(() => {
              chrome.tabs.sendMessage(tabId, { action: 'GET_INFO' }, (res2) => {
                if (res2) {
                  totalMsgsEl.innerText = res2.totalMessages + ' tin nhắn';
                  selectedMsgsEl.innerText = res2.selectedCount + ' mục';
                  if (res2.selectedCount > 0) scopeSelectedBtn.click();
                } else {
                  totalMsgsEl.innerText = 'Cần tải lại trang';
                  tipBox.innerHTML = '💡 Vui lòng bấm nút <strong>"🔁 Tải lại trang (F5)"</strong> bên dưới để kích hoạt tiện ích trên tab Gemini này.';
                }
              });
            }, 350);
          }).catch(err => {
            totalMsgsEl.innerText = 'Không thể tiêm vào tab';
          });
        } else {
          totalMsgsEl.innerText = 'Cần tải lại trang';
        }
        return;
      }

      totalMsgsEl.innerText = response.totalMessages + ' tin nhắn';
      selectedMsgsEl.innerText = response.selectedCount + ' mục';

      if (response.selectedCount > 0) {
        scopeSelectedBtn.click();
      }
    });
  }

  if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab || !activeTab.id) return;

      const url = activeTab.url || '';
      const isAI = updatePlatformBadge(url);

      if (isAI) {
        queryTabInfo(activeTab.id);
      }

      // Nút quét lại
      if (rescanBtn) {
        rescanBtn.addEventListener('click', () => {
          queryTabInfo(activeTab.id);
        });
      }

      // Nút tải lại tab (F5)
      if (reloadBtn) {
        reloadBtn.addEventListener('click', () => {
          chrome.tabs.reload(activeTab.id, () => {
            window.close();
          });
        });
      }

      // Nút tải các định dạng
      document.querySelectorAll('[data-fmt]').forEach(btn => {
        btn.addEventListener('click', () => {
          const format = btn.getAttribute('data-fmt');
          btn.disabled = true;
          const origText = btn.innerText;
          btn.innerText = '⏳ Đang tạo...';

          chrome.tabs.sendMessage(activeTab.id, {
            action: 'EXPORT',
            format: format,
            scope: currentScope
          }, (res) => {
            if (chrome.runtime.lastError || !res || !res.success) {
              // Dự phòng: Nếu content script bị lỗi kết nối, thực thi trực tiếp bằng scripting
              if (chrome.scripting) {
                chrome.scripting.executeScript({
                  target: { tabId: activeTab.id },
                  files: ['content.js']
                }).then(() => {
                  setTimeout(() => {
                    chrome.tabs.sendMessage(activeTab.id, {
                      action: 'EXPORT',
                      format: format,
                      scope: currentScope
                    });
                  }, 250);
                });
              }
            }

            setTimeout(() => {
              btn.disabled = false;
              btn.innerText = origText;
            }, 1200);
          });
        });
      });
    });
  }
});
