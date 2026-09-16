/**
 * =========================================================================
 * 🎓 AI STUDY EXPORTER - CHROME EXTENSION CONTENT SCRIPT v2.4.0
 * =========================================================================
 * - Trích xuất học thuật trên Google Gemini & ChatGPT
 * - Bảo toàn 100% công thức Toán KaTeX/LaTeX, Bảng biểu & Code
 * - Giao diện khoa học, siêu mỏng nhẹ, hòa hợp 100% với giao diện chat
 * - Xuất PDF A4 trực tiếp qua Hidden Iframe (miễn dịch Popup Blocker)
 * - Xuất Word .doc, Markdown .md, Web Offline .html, LaTeX .tex & Anki .txt
 * =========================================================================
 */

(function () {
  'use strict';

  if (window.__STUDY_EXPORTER_INITIALIZED__) {
    console.log('[AI Study Exporter] Tiện ích đã nạp, đang làm mới thanh công cụ...');
    if (typeof window.__STUDY_EXPORTER_REFRESH__ === 'function') {
      window.__STUDY_EXPORTER_REFRESH__();
    }
    return;
  }
  window.__STUDY_EXPORTER_INITIALIZED__ = true;

  console.log('🎓 [AI Study Exporter v2.4.0] Đã kích hoạt hệ thống học thuật!');

  const IS_GEMINI = window.location.hostname.includes('gemini.google.com');
  const IS_CHATGPT = window.location.hostname.includes('chatgpt.com') || window.location.hostname.includes('chat.openai.com');

  const selectedMsgIndices = new Set();
  let discoveredMessages = [];

  // 1. Tiêm CSS giao diện nếu chưa có
  function ensureStylesInjected() {
    if (document.getElementById('study-exporter-style-sheet')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'study-exporter-style-sheet';
    styleEl.textContent = `
      .study-turn-selected {
        position: relative !important;
        border-left: 3.5px solid #2563eb !important;
        background-color: rgba(37, 99, 235, 0.025) !important;
        border-radius: 4px 8px 8px 4px !important;
        padding-left: 8px !important;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
      @media (prefers-color-scheme: dark) {
        .study-turn-selected {
          border-left-color: #3b82f6 !important;
          background-color: rgba(59, 130, 246, 0.05) !important;
        }
      }
      .study-user-bar {
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        gap: 8px !important;
        margin: 4px 0 6px 0 !important;
        width: 100% !important;
        box-sizing: border-box !important;
        user-select: none !important;
        background: transparent !important;
        border: none !important;
      }
      .study-assistant-bar {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        flex-wrap: wrap !important;
        gap: 8px !important;
        margin: 4px 0 10px 0 !important;
        padding: 4px 0 6px 0 !important;
        border-bottom: 1px dashed rgba(203, 213, 225, 0.7) !important;
        background: transparent !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        font-size: 12px !important;
        color: #475569 !important;
        width: 100% !important;
        box-sizing: border-box !important;
        user-select: none !important;
      }
      @media (prefers-color-scheme: dark) {
        .study-assistant-bar {
          border-bottom-color: rgba(51, 65, 85, 0.7) !important;
          color: #94a3b8 !important;
        }
      }
      .study-bar-meta {
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        font-size: 11.5px !important;
        font-weight: 500 !important;
        color: #64748b !important;
      }
      @media (prefers-color-scheme: dark) {
        .study-bar-meta { color: #94a3b8 !important; }
      }
      .study-meta-dot { color: #cbd5e1 !important; font-size: 9px !important; }
      .study-bar-actions {
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        position: relative !important;
      }
      .study-pill-btn {
        display: inline-flex !important;
        align-items: center !important;
        gap: 5px !important;
        padding: 3px 10px !important;
        border-radius: 20px !important;
        font-size: 11.5px !important;
        font-weight: 600 !important;
        border: 1px solid #cbd5e1 !important;
        background: #ffffff !important;
        color: #334155 !important;
        cursor: pointer !important;
        transition: all 0.15s ease !important;
        line-height: 1.4 !important;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03) !important;
      }
      .study-pill-btn:hover {
        background: #f8fafc !important;
        border-color: #94a3b8 !important;
        color: #0f172a !important;
      }
      .study-pill-btn.checked {
        background: #eff6ff !important;
        border-color: #2563eb !important;
        color: #1d4ed8 !important;
      }
      @media (prefers-color-scheme: dark) {
        .study-pill-btn {
          background: #1e293b !important;
          border-color: #475569 !important;
          color: #e2e8f0 !important;
        }
        .study-pill-btn:hover { background: #334155 !important; color: #fff !important; }
        .study-pill-btn.checked { background: #1e3a8a !important; border-color: #3b82f6 !important; color: #93c5fd !important; }
      }
      .study-cb-native {
        width: 14px !important;
        height: 14px !important;
        margin: 0 !important;
        accent-color: #2563eb !important;
        cursor: pointer !important;
      }
      .study-sub-btn {
        display: inline-flex !important;
        align-items: center !important;
        gap: 4px !important;
        padding: 3px 8px !important;
        border-radius: 6px !important;
        font-size: 11px !important;
        font-weight: 600 !important;
        border: 1px solid rgba(203, 213, 225, 0.8) !important;
        background: rgba(255, 255, 255, 0.9) !important;
        color: #475569 !important;
        cursor: pointer !important;
        transition: all 0.15s ease !important;
      }
      .study-sub-btn:hover {
        background: #f1f5f9 !important;
        color: #0f172a !important;
        border-color: #94a3b8 !important;
      }
      @media (prefers-color-scheme: dark) {
        .study-sub-btn {
          background: rgba(30, 41, 59, 0.9) !important;
          border-color: #475569 !important;
          color: #cbd5e1 !important;
        }
        .study-sub-btn:hover { background: #334155 !important; color: #f8fafc !important; }
      }
      .study-quick-dropdown {
        position: absolute !important;
        top: 100% !important;
        right: 0 !important;
        margin-top: 4px !important;
        z-index: 2000 !important;
        background: #ffffff !important;
        border: 1px solid #cbd5e1 !important;
        border-radius: 10px !important;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12) !important;
        padding: 4px !important;
        min-width: 175px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 2px !important;
      }
      @media (prefers-color-scheme: dark) {
        .study-quick-dropdown {
          background: #1e293b !important;
          border-color: #475569 !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.4) !important;
        }
      }
      .study-drop-item {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        padding: 6px 10px !important;
        border-radius: 6px !important;
        font-size: 11.5px !important;
        font-weight: 600 !important;
        color: #334155 !important;
        background: transparent !important;
        border: none !important;
        cursor: pointer !important;
        text-align: left !important;
        width: 100% !important;
      }
      .study-drop-item:hover { background: #eff6ff !important; color: #2563eb !important; }
      @media (prefers-color-scheme: dark) {
        .study-drop-item { color: #cbd5e1 !important; }
        .study-drop-item:hover { background: #334155 !important; color: #60a5fa !important; }
      }
      
      #study-toast {
        position: fixed !important;
        top: 24px !important;
        right: 24px !important;
        left: auto !important;
        bottom: auto !important;
        transform: none !important;
        background: #0f172a !important;
        color: #ffffff !important;
        padding: 10px 18px !important;
        border-radius: 12px !important;
        font-size: 12.5px !important;
        font-weight: 600 !important;
        box-shadow: 0 10px 30px rgba(0,0,0,0.25) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        z-index: 2147483647 !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        max-width: 420px !important;
      }
      
      #study-modal-overlay {
        position: fixed !important;
        inset: 0 !important;
        z-index: 2147483647 !important;
        background: rgba(15, 23, 42, 0.6) !important;
        backdrop-filter: blur(4px) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 16px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      }
      .study-dialog-card { background: #ffffff !important; width: 100%; max-width: 520px; border-radius: 16px; padding: 22px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
      @media (prefers-color-scheme: dark) { .study-dialog-card { background: #0f172a !important; color: #f8fafc !important; border: 1px solid #334155 !important; } }
      .dialog-header { display: flex !important; align-items: center !important; justify-content: space-between !important; border-bottom: 1px solid #e2e8f0 !important; padding-bottom: 12px !important; margin-bottom: 14px !important; }
      @media (prefers-color-scheme: dark) { .dialog-header { border-color: #1e293b !important; } }
      .dialog-title { margin: 0 !important; font-size: 16px !important; font-weight: 800 !important; color: #0f172a !important; }
      @media (prefers-color-scheme: dark) { .dialog-title { color: #f8fafc !important; } }
      .dialog-close { background: transparent !important; border: none !important; font-size: 20px !important; color: #64748b !important; cursor: pointer !important; }
      .dialog-grid { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
      .format-option { display: flex !important; flex-direction: column !important; align-items: flex-start !important; gap: 4px !important; padding: 12px !important; border-radius: 10px !important; border: 1.5px solid #e2e8f0 !important; background: #f8fafc !important; cursor: pointer !important; text-align: left !important; transition: all 0.15s ease !important; }
      .format-option:hover { border-color: #2563eb !important; background: #eff6ff !important; transform: translateY(-1.5px) !important; }
      @media (prefers-color-scheme: dark) { .format-option { background: #1e293b !important; border-color: #334155 !important; } .format-option:hover { background: #1e3a8a !important; border-color: #60a5fa !important; } }
      .fmt-head { display: flex !important; align-items: center !important; gap: 6px !important; font-weight: 700 !important; font-size: 13px !important; color: #0f172a !important; }
      @media (prefers-color-scheme: dark) { .fmt-head { color: #f8fafc !important; } }
      .fmt-desc { font-size: 11px !important; color: #64748b !important; line-height: 1.35 !important; }
    `;
    document.head.appendChild(styleEl);
  }

  function showToast(msg) {
    let t = document.getElementById('study-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'study-toast';
      document.body.appendChild(t);
    }
    t.innerHTML = msg;
    t.style.display = 'flex';
    clearTimeout(window.__studyToastTimer);
    window.__studyToastTimer = setTimeout(() => {
      if (t) t.style.display = 'none';
    }, 4000);
  }

  function getChatTitle() {
    let t = document.title || '';
    t = t.replace(/ - Gemini| \| ChatGPT/gi, '').trim();
    if (!t || t === 'Gemini' || t === 'ChatGPT') {
      const firstUser = discoveredMessages.find(m => m.role === 'user');
      if (firstUser && firstUser.text) {
        t = firstUser.text.slice(0, 30).trim();
      } else {
        t = 'Tai_Lieu_Hoc_Tap_' + new Date().toLocaleDateString('vi-VN').replace(/\//g, '-');
      }
    }
    return t.replace(/[/\\?%*:|"<>]/g, '_').trim();
  }

  // Trích xuất mã nguồn LaTeX nguyên bản từ node KaTeX
  function extractLatexFromKatex(el) {
    if (!el) return null;
    const ann = el.querySelector('annotation[encoding*="tex"]') || 
                el.querySelector('annotation') || 
                el.querySelector('[data-tex]');
    if (ann && ann.textContent.trim()) {
      return ann.textContent.trim();
    }
    const dt = el.getAttribute('data-tex') || el.getAttribute('data-original-tex');
    if (dt && dt.trim()) return dt.trim();
    return null;
  }

  // Làm sạch công thức Toán KaTeX/MathJax & Bảng
  function cleanMathForExport(containerEl) {
    if (!containerEl) return document.createElement('div');
    const clone = containerEl.cloneNode(true);
    // Xóa tất cả các thanh công cụ chèn vào
    clone.querySelectorAll('.study-user-bar, .study-assistant-bar, .study-msg-bar').forEach(el => el.remove());
    // Xóa các nút copy, like, dislike, share của ChatGPT & Gemini
    clone.querySelectorAll('button, svg, [role="button"], [aria-label*="Copy"], [aria-label*="Sao chép"]').forEach(el => el.remove());

    // 1. Xử lý Block Math KaTeX
    clone.querySelectorAll('.katex-display').forEach(kd => {
      const tex = extractLatexFromKatex(kd);
      if (tex) {
        const p = document.createElement('p');
        p.className = 'export-math-block';
        p.textContent = '$$ ' + tex + ' $$';
        kd.replaceWith(p);
      } else {
        const mathml = kd.querySelector('.katex-mathml');
        if (mathml) mathml.remove();
      }
    });

    // 2. Xử lý Inline Math KaTeX
    clone.querySelectorAll('.katex').forEach(k => {
      if (k.closest('.export-math-block') || k.closest('.katex-display')) return;
      const tex = extractLatexFromKatex(k);
      if (tex) {
        const span = document.createElement('span');
        span.className = 'export-math-inline';
        span.textContent = ' $' + tex + '$ ';
        k.replaceWith(span);
      } else {
        const mathml = k.querySelector('.katex-mathml');
        if (mathml) mathml.remove();
      }
    });

    return clone;
  }

  // Quét danh sách tin nhắn trên trang
  function scanChatMessages() {
    const list = [];

    if (IS_GEMINI) {
      let turns = Array.from(document.querySelectorAll('user-query, model-response, .chat-turn, [data-test-id*="turn"], ms-cmark-node'));
      if (turns.length === 0) {
        turns = Array.from(document.querySelectorAll('message-content, .model-response-text, .response-container'));
      }
      if (turns.length === 0) {
        turns = Array.from(document.querySelectorAll('.markdown, [role="region"]'));
      }

      turns.forEach((turn, idx) => {
        if (turn.closest('#study-modal-overlay')) return;
        if (list.some(item => item.el.contains(turn) || turn.contains(item.el))) return;

        const tagName = (turn.tagName || '').toLowerCase();
        const className = turn.className || '';
        const isUser = tagName === 'user-query' ||
                       className.includes('user-query') ||
                       turn.querySelector('.user-query-container') !== null ||
                       turn.querySelector('.query-text') !== null;

        const contentEl = turn.querySelector('message-content, .markdown, .model-response-text, .query-text') || turn;
        if (!contentEl || !contentEl.innerText || contentEl.innerText.trim().length === 0) return;

        const mathCount = contentEl.querySelectorAll('.katex, math, .katex-display').length;
        const tableCount = contentEl.querySelectorAll('table').length;
        const codeCount = contentEl.querySelectorAll('pre, code').length;

        list.push({
          index: idx,
          id: 'gemini-turn-' + idx,
          role: isUser ? 'user' : 'assistant',
          el: turn,
          insertionTarget: turn.querySelector('message-content, .query-text') || turn,
          visualContainer: turn,
          contentEl: contentEl,
          text: contentEl.innerText.trim(),
          mathCount,
          tableCount,
          codeCount
        });
      });
    } else {
      // =====================================
      // 🟢 QUÉT TIN NHẮN CHATGPT
      // =====================================
      let rawTurns = Array.from(document.querySelectorAll('article'));
      if (rawTurns.length === 0) {
        rawTurns = Array.from(document.querySelectorAll('[data-message-author-role]'));
      }
      if (rawTurns.length === 0) {
        rawTurns = Array.from(document.querySelectorAll('[data-testid^="conversation-turn-"], .text-message'));
      }

      // Khử trùng lặp: loại bỏ các element con nằm bên trong element khác
      const turns = rawTurns.filter((el, idx, arr) => {
        if (el.closest('#study-modal-overlay')) return false;
        return !arr.some(other => other !== el && other.contains(el));
      });

      turns.forEach((turn, idx) => {
        if (list.some(item => item.el === turn)) return;

        // Phân biệt vai trò
        const roleAttrEl = turn.querySelector('[data-message-author-role]') || (turn.hasAttribute('data-message-author-role') ? turn : null);
        const roleVal = roleAttrEl ? roleAttrEl.getAttribute('data-message-author-role') : null;

        let isUser = false;
        if (roleVal) {
          isUser = (roleVal === 'user');
        } else {
          isUser = turn.querySelector('.whitespace-pre-wrap') !== null && turn.querySelector('.markdown') === null;
        }

        let contentEl = null;
        let insertionTarget = null;
        let visualContainer = turn;

        if (isUser) {
          contentEl = turn.querySelector('[data-message-author-role="user"] .whitespace-pre-wrap') ||
                      turn.querySelector('.whitespace-pre-wrap') ||
                      turn.querySelector('[data-message-author-role="user"]') ||
                      turn;

          insertionTarget = turn.querySelector('[data-message-author-role="user"]') ||
                            turn.querySelector('.whitespace-pre-wrap')?.closest('div.items-end, div.relative') ||
                            turn.querySelector('.whitespace-pre-wrap') ||
                            turn;
          visualContainer = insertionTarget;
        } else {
          contentEl = turn.querySelector('.markdown') ||
                      turn.querySelector('[data-message-author-role="assistant"]') ||
                      turn.querySelector('[class*="agent-turn"]') ||
                      turn;

          insertionTarget = turn.querySelector('.markdown') || contentEl;
          visualContainer = insertionTarget;
        }

        if (!contentEl || !contentEl.innerText || contentEl.innerText.trim().length === 0) return;

        const mathCount = contentEl.querySelectorAll('.katex, math, .katex-display').length;
        const tableCount = contentEl.querySelectorAll('table').length;
        const codeCount = contentEl.querySelectorAll('pre, code').length;

        list.push({
          index: idx,
          id: 'chatgpt-turn-' + idx,
          role: isUser ? 'user' : 'assistant',
          el: turn,
          insertionTarget: insertionTarget,
          visualContainer: visualContainer,
          contentEl: contentEl,
          text: contentEl.innerText.trim(),
          mathCount,
          tableCount,
          codeCount
        });
      });
    }

    discoveredMessages = list;
    return list;
  }

  // Tiêm thanh công cụ gắn vào từng tin nhắn
  function injectMessageToolbars() {
    ensureStylesInjected();
    const msgs = scanChatMessages();

    msgs.forEach((item) => {
      // Dọn dẹp bản cũ nếu có
      item.el.querySelectorAll('.study-msg-bar').forEach(el => el.remove());

      const target = item.insertionTarget || item.el;
      const targetParent = target.parentNode || item.el;
      const vContainer = item.visualContainer || item.el;

      if (item.role === 'user') {
        // =====================================
        // TIN NHẮN HỌC VIÊN: THANH MINI CĂN PHẢI
        // =====================================
        let userBar = (targetParent && targetParent.querySelector(':scope > .study-user-bar')) || item.el.querySelector('.study-user-bar');
        if (!userBar) {
          userBar = document.createElement('div');
          userBar.className = 'study-user-bar';

          const cbLabel = document.createElement('label');
          cbLabel.className = 'study-pill-btn' + (selectedMsgIndices.has(item.index) ? ' checked' : '');

          const cbInput = document.createElement('input');
          cbInput.type = 'checkbox';
          cbInput.className = 'study-cb-native';
          cbInput.checked = selectedMsgIndices.has(item.index);

          const cbText = document.createElement('span');
          cbText.textContent = cbInput.checked ? 'Đã chọn câu hỏi' : 'Chọn câu hỏi';

          cbInput.addEventListener('change', (e) => {
            e.stopPropagation();
            toggleMessageSelect(item.index, cbInput.checked);
          });

          cbLabel.appendChild(cbInput);
          cbLabel.appendChild(cbText);
          userBar.appendChild(cbLabel);

          // Tiêm ngay trước target
          if (target !== item.el && targetParent) {
            targetParent.insertBefore(userBar, target);
          } else {
            item.el.insertBefore(userBar, item.el.firstChild);
          }
        } else {
          const cb = userBar.querySelector('.study-cb-native');
          const cbLabel = userBar.querySelector('.study-pill-btn');
          const cbText = cbLabel ? cbLabel.querySelector('span') : null;
          if (cb) {
            const isSel = selectedMsgIndices.has(item.index);
            cb.checked = isSel;
            if (cbLabel) cbLabel.className = 'study-pill-btn' + (isSel ? ' checked' : '');
            if (cbText) cbText.textContent = isSel ? 'Đã chọn câu hỏi' : 'Chọn câu hỏi';
          }
        }
      } else {
        // =====================================
        // TIN NHẮN TRỢ LÝ AI: ACADEMIC ACTION BAR
        // =====================================
        let assistantBar = (targetParent && targetParent.querySelector(':scope > .study-assistant-bar')) || item.el.querySelector('.study-assistant-bar');
        if (!assistantBar) {
          assistantBar = document.createElement('div');
          assistantBar.className = 'study-assistant-bar';

          // Trái: Metadata học thuật
          const metaBox = document.createElement('div');
          metaBox.className = 'study-bar-meta';

          let metaPieces = [];
          if (item.mathCount > 0) metaPieces.push('📐 ' + item.mathCount + ' công thức');
          if (item.tableCount > 0) metaPieces.push('📊 ' + item.tableCount + ' bảng');
          if (item.codeCount > 0) metaPieces.push('💻 ' + item.codeCount + ' mã');
          if (metaPieces.length === 0) metaPieces.push('📖 Lời giải chi tiết');

          metaBox.innerHTML = metaPieces.join(' <span class="study-meta-dot">•</span> ');
          assistantBar.appendChild(metaBox);

          // Phải: Nút Checkbox + Nút Xuất ▾ + Nút Chép
          const actionsBox = document.createElement('div');
          actionsBox.className = 'study-bar-actions';

          const cbLabel = document.createElement('label');
          cbLabel.className = 'study-pill-btn' + (selectedMsgIndices.has(item.index) ? ' checked' : '');

          const cbInput = document.createElement('input');
          cbInput.type = 'checkbox';
          cbInput.className = 'study-cb-native';
          cbInput.checked = selectedMsgIndices.has(item.index);

          const cbText = document.createElement('span');
          cbText.textContent = cbInput.checked ? 'Đã chọn đoạn' : 'Chọn đoạn';

          cbInput.addEventListener('change', (e) => {
            e.stopPropagation();
            toggleMessageSelect(item.index, cbInput.checked);
          });

          cbLabel.appendChild(cbInput);
          cbLabel.appendChild(cbText);
          actionsBox.appendChild(cbLabel);

          // Nút Xuất Nhanh Dropdown
          const quickBtn = document.createElement('button');
          quickBtn.className = 'study-sub-btn';
          quickBtn.innerHTML = '⚡ Xuất ▾';
          quickBtn.title = 'Xuất riêng đoạn tin nhắn này';
          quickBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openQuickMenu(actionsBox, item);
          });
          actionsBox.appendChild(quickBtn);

          // Nút Chép
          const copyBtn = document.createElement('button');
          copyBtn.className = 'study-sub-btn';
          copyBtn.innerHTML = '📋 Chép';
          copyBtn.title = 'Chép nội dung đã định dạng';
          copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const cleanEl = cleanMathForExport(item.contentEl);
            navigator.clipboard.writeText(cleanEl.innerText.trim()).then(() => {
              showToast('✅ Đã chép nội dung tin nhắn vào khay nhớ tạm!');
            });
          });
          actionsBox.appendChild(copyBtn);

          assistantBar.appendChild(actionsBox);

          // Tiêm ngay trước target
          if (target !== item.el && targetParent) {
            targetParent.insertBefore(assistantBar, target);
          } else {
            item.el.insertBefore(assistantBar, item.el.firstChild);
          }
        } else {
          const cb = assistantBar.querySelector('.study-cb-native');
          const cbLabel = assistantBar.querySelector('.study-pill-btn');
          const cbText = cbLabel ? cbLabel.querySelector('span') : null;
          if (cb) {
            const isSel = selectedMsgIndices.has(item.index);
            cb.checked = isSel;
            if (cbLabel) cbLabel.className = 'study-pill-btn' + (isSel ? ' checked' : '');
            if (cbText) cbText.textContent = isSel ? 'Đã chọn đoạn' : 'Chọn đoạn';
          }
        }
      }

      if (selectedMsgIndices.has(item.index)) {
        vContainer.classList.add('study-turn-selected');
      } else {
        vContainer.classList.remove('study-turn-selected');
      }
    });
  }

  function openQuickMenu(parentEl, item) {
    const old = document.querySelector('.study-quick-dropdown');
    if (old) old.remove();

    const menu = document.createElement('div');
    menu.className = 'study-quick-dropdown';

    const formats = [
      { id: 'pdf', icon: '📄', label: 'In / Lưu PDF (A4)' },
      { id: 'word', icon: '📝', label: 'Xuất Word (.doc)' },
      { id: 'md', icon: '📜', label: 'Xuất Markdown (.md)' },
      { id: 'html', icon: '🌐', label: 'Xuất HTML Offline' }
    ];

    formats.forEach(f => {
      const btn = document.createElement('button');
      btn.className = 'study-drop-item';
      btn.innerHTML = '<span>' + f.icon + '</span><span>' + f.label + '</span>';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.remove();
        executeExport(f.id, [item]);
      });
      menu.appendChild(btn);
    });

    parentEl.appendChild(menu);

    const closeHandler = () => {
      menu.remove();
      document.removeEventListener('click', closeHandler);
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 10);
  }

  function toggleMessageSelect(index, isChecked) {
    if (isChecked) {
      selectedMsgIndices.add(index);
    } else {
      selectedMsgIndices.delete(index);
    }

    const item = discoveredMessages.find(m => m.index === index);
    if (item) {
      const vContainer = item.visualContainer || item.el;
      if (isChecked) {
        vContainer.classList.add('study-turn-selected');
      } else {
        vContainer.classList.remove('study-turn-selected');
      }
      
      const targetParent = (item.insertionTarget && item.insertionTarget.parentNode) || item.el;
      const bar = (targetParent && targetParent.querySelector('.study-user-bar, .study-assistant-bar')) || item.el.querySelector('.study-user-bar, .study-assistant-bar');
      const label = bar ? bar.querySelector('.study-pill-btn') : null;
      const text = label ? label.querySelector('span') : null;
      if (label) label.className = 'study-pill-btn' + (isChecked ? ' checked' : '');
      if (text) {
        if (item.role === 'user') {
          text.textContent = isChecked ? 'Đã chọn câu hỏi' : 'Chọn câu hỏi';
        } else {
          text.textContent = isChecked ? 'Đã chọn đoạn' : 'Chọn đoạn';
        }
      }
    }
  }

  // Tải file bằng Blob & Synthetic Event
  function triggerDownload(content, filename, mimeType) {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.setAttribute('download', filename);
    document.body.appendChild(a);

    const evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
    a.dispatchEvent(evt);

    setTimeout(() => {
      if (a.parentNode) a.parentNode.removeChild(a);
      URL.revokeObjectURL(url);
    }, 3000);
  } catch (err) {
    console.error('Lỗi khi tải file:', err);
    try {
      const a = document.createElement('a');
      a.href = 'data:' + mimeType + ',' + encodeURIComponent(content);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => a.remove(), 1500);
    } catch (e2) {
      alert('Trình duyệt chặn tải tự động. Vui lòng thử lại hoặc chọn sao chép nội dung.');
    }
  }
}

  // ==========================================
  // HỆ THỐNG XUẤT FILE HỌC THUẬT
  // ==========================================

  function getTargetMessages(specifiedMsgs) {
    if (specifiedMsgs && specifiedMsgs.length > 0) return specifiedMsgs;
    if (selectedMsgIndices.size > 0) {
      return discoveredMessages.filter(m => selectedMsgIndices.has(m.index));
    }
    return discoveredMessages;
  }

  function executeExport(format, specifiedMsgs) {
    const msgs = getTargetMessages(specifiedMsgs);
    if (!msgs || msgs.length === 0) {
      alert('Chưa có tin nhắn nào để xuất. Hãy tích chọn một đoạn hoặc kéo cuộn trang!');
      return;
    }

    const title = getChatTitle();

    if (format === 'pdf') {
      exportToPdfEngine(msgs, title);
    } else if (format === 'word') {
      exportToWordDoc(msgs, title);
    } else if (format === 'md') {
      exportToMarkdownFile(msgs, title);
    } else if (format === 'html') {
      exportToHtmlStandalone(msgs, title);
    } else if (format === 'latex') {
      exportToLatexFile(msgs, title);
    } else if (format === 'anki') {
      exportToAnkiFile(msgs, title);
    } else if (format === 'copy') {
      copyAllToClipboard(msgs);
    }
  }

  // 1. Xuất PDF: Iframe In Ẩn
  function exportToPdfEngine(msgs, title) {
    showToast('📄 Đang chuẩn bị bản in PDF A4...');

    const printableHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>${title} - Bản In Học Thuật A4</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
  <style>
    @page { size: A4; margin: 16mm 14mm 16mm 14mm; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; line-height: 1.6; margin: 0; padding: 16px; font-size: 13pt; }
    .header-box { border-bottom: 2.5px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px; }
    h1 { font-size: 18pt; margin: 0 0 6px 0; color: #1e3a8a; }
    .meta-info { font-size: 10pt; color: #64748b; }
    .turn-card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin-bottom: 18px; page-break-inside: avoid; }
    .turn-card.user { background: #f8fafc; border-left: 4px solid #2563eb; }
    .turn-card.assistant { background: #ffffff; border-left: 4px solid #16a34a; }
    .speaker-name { font-weight: 700; font-size: 11pt; margin-bottom: 8px; }
    .user .speaker-name { color: #1d4ed8; }
    .assistant .speaker-name { color: #15803d; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 11pt; }
    th, td { border: 1px solid #94a3b8; padding: 8px 10px; text-align: left; }
    th { background-color: #f1f5f9; font-weight: bold; }
    pre, code { background: #f1f5f9; font-family: 'Consolas', monospace; font-size: 10.5pt; border-radius: 4px; }
    pre { padding: 10px; overflow-x: auto; border: 1px solid #e2e8f0; }
    .no-print-bar { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 10px 14px; margin-bottom: 20px; text-align: center; }
    .print-btn { background: #2563eb; color: #ffffff; border: none; padding: 9px 20px; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer; }
    @media print { .no-print-bar { display: none !important; } }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <button class="print-btn" onclick="window.print()">🖨️ Bấm vào đây để In / Lưu thành file PDF</button>
    <div style="font-size:11px;color:#1e40af;margin-top:4px;">(Chọn máy in: <strong>"Lưu dưới dạng PDF / Save as PDF"</strong>)</div>
  </div>
  <div class="header-box">
    <h1>${title}</h1>
    <div class="meta-info">Trích xuất từ AI Study Exporter • Ngày: ${new Date().toLocaleDateString('vi-VN')}</div>
  </div>
  ${msgs.map((m, idx) => {
    const cleanEl = cleanMathForExport(m.contentEl);
    return `
    <div class="turn-card ${m.role}">
      <div class="speaker-name">${m.role === 'user' ? '👤 Học viên / Câu hỏi #' + (idx + 1) : '🤖 Trợ lý AI / Lời giải'}</div>
      <div>${cleanEl.innerHTML}</div>
    </div>`;
  }).join('')}
</body>
</html>`;

    try {
      let iframe = document.getElementById('study-print-iframe');
      if (iframe) iframe.remove();
      iframe = document.createElement('iframe');
      iframe.id = 'study-print-iframe';
      iframe.style.position = 'fixed';
      iframe.style.right = '-9999px';
      iframe.style.bottom = '-9999px';
      iframe.style.width = '100px';
      iframe.style.height = '100px';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(printableHtml);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          showToast('📄 Đang mở hộp thoại In PDF. Hãy chọn <strong>"Lưu dưới dạng PDF"</strong>!');
        } catch (printErr) {
          triggerDownload(printableHtml, title + '_Ban_In_A4.html', 'text/html;charset=utf-8');
          showToast('📄 Đã tải file HTML chuẩn in A4!');
        }
      }, 500);
    } catch (e) {
      triggerDownload(printableHtml, title + '_Ban_In_A4.html', 'text/html;charset=utf-8');
      showToast('📄 Đã tải file HTML in ấn A4!');
    }
  }

  // 2. Xuất Word (.doc)
  function exportToWordDoc(msgs, title) {
    const docHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <!--[if gte mso 9]>
  <xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml>
  <![endif]-->
  <style>
    body { font-family: 'Times New Roman', 'Segoe UI', serif; font-size: 12pt; line-height: 1.5; color: #000; }
    h1 { font-size: 18pt; color: #1e3a8a; text-align: center; border-bottom: 2pt solid #2563eb; padding-bottom: 6pt; }
    .role-header { font-weight: bold; font-size: 13pt; margin-top: 16pt; margin-bottom: 4pt; }
    .role-user { color: #1d4ed8; }
    .role-assistant { color: #15803d; }
    table { border-collapse: collapse; width: 100%; margin: 10pt 0; }
    th, td { border: 1pt solid #475569; padding: 6pt 8pt; text-align: left; }
    th { background-color: #f1f5f9; font-weight: bold; }
    hr { border: none; border-top: 1pt solid #cbd5e1; margin: 14pt 0; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p style="text-align:center;font-size:10pt;color:#64748b;">Trích xuất từ AI Study Exporter • Ngày: ${new Date().toLocaleDateString('vi-VN')}</p>
  ${msgs.map(m => {
    const cleanEl = cleanMathForExport(m.contentEl);
    return `
    <div class="role-header ${m.role === 'user' ? 'role-user' : 'role-assistant'}">${m.role === 'user' ? '👤 Câu hỏi / Học viên:' : '🤖 Lời giải / Trợ lý AI:'}</div>
    <div>${cleanEl.innerHTML}</div>
    <hr/>`;
  }).join('')}
</body>
</html>`;

    triggerDownload('\uFEFF' + docHtml, title + '.doc', 'application/msword;charset=utf-8');
  }

  // 3. Xuất Markdown (.md)
  function exportToMarkdownFile(msgs, title) {
    let md = '# ' + title + '\n\n';
    md += '> 📅 *Ngày trích xuất: ' + new Date().toLocaleDateString('vi-VN') + ' | AI Study Exporter*\n\n---\n\n';

    msgs.forEach((m, idx) => {
      md += '### ' + (m.role === 'user' ? '👤 Học viên / Câu hỏi #' + (idx + 1) : '🤖 Lời giải chi tiết / Trợ lý AI') + '\n\n';
      const cleanEl = cleanMathForExport(m.contentEl);

      cleanEl.querySelectorAll('table').forEach(table => {
        let mdTable = '\n';
        const rows = Array.from(table.querySelectorAll('tr'));
        rows.forEach((row, rIdx) => {
          const cells = Array.from(row.querySelectorAll('th, td')).map(c => c.innerText.trim().replace(/\|/g, '\\|'));
          if (cells.length > 0) {
            mdTable += '| ' + cells.join(' | ') + ' |\n';
            if (rIdx === 0) mdTable += '| ' + cells.map(() => '---').join(' | ') + ' |\n';
          }
        });
        const p = document.createElement('p');
        p.textContent = mdTable + '\n';
        table.replaceWith(p);
      });

      md += cleanEl.innerText.trim() + '\n\n---\n\n';
    });

    triggerDownload(md, title + '.md', 'text/markdown;charset=utf-8');
  }

  // 4. Xuất HTML Offline
  function exportToHtmlStandalone(msgs, title) {
    const htmlDoc = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 900px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #1e293b; background: #ffffff; }
    h1 { font-size: 24px; color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
    .card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px; background: #f8fafc; }
    .card.user { background: #eff6ff; border-color: #bfdbfe; }
    .card-title { font-weight: 700; font-size: 14px; margin-bottom: 10px; color: #1d4ed8; }
    .card.assistant .card-title { color: #15803d; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; background: #fff; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; }
    th { background: #f1f5f9; }
    pre { background: #0f172a; color: #f8fafc; padding: 12px; border-radius: 8px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  ${msgs.map(m => {
    const cleanEl = cleanMathForExport(m.contentEl);
    return `
    <div class="card ${m.role}">
      <div class="card-title">${m.role === 'user' ? '👤 Câu hỏi / Học viên' : '🤖 Lời giải / Trợ lý AI'}</div>
      <div>${cleanEl.innerHTML}</div>
    </div>`;
  }).join('')}
</body>
</html>`;

    triggerDownload(htmlDoc, title + '.html', 'text/html;charset=utf-8');
  }

  // 5. Xuất LaTeX (.tex)
  function exportToLatexFile(msgs, title) {
    let tex = `\\documentclass[12pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[vietnamese]{babel}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{geometry}
\\geometry{margin=2cm}
\\title{${title.replace(/[_#%&]/g, ' ')}}
\\author{AI Study Exporter}
\\date{\\today}

\\begin{document}
\\maketitle

`;

    msgs.forEach((m, idx) => {
      tex += '\\section*{' + (m.role === 'user' ? 'Câu hỏi ' + (idx + 1) : 'Lời giải chi tiết') + '}\n';
      const cleanEl = cleanMathForExport(m.contentEl);
      tex += cleanEl.innerText.trim().replace(/%/g, '\\%') + '\n\n\\hrulefill\n\n';
    });

    tex += '\\end{document}';
    triggerDownload(tex, title + '.tex', 'text/x-tex;charset=utf-8');
  }

  // 6. Xuất Anki (.txt)
  function exportToAnkiFile(msgs, title) {
    let tsv = '';
    for (let i = 0; i < msgs.length; i++) {
      if (msgs[i].role === 'user') {
        const q = msgs[i].text.replace(/\t/g, ' ').replace(/\n/g, '<br>');
        let a = 'Chưa có lời giải';
        if (i + 1 < msgs.length && msgs[i + 1].role === 'assistant') {
          a = msgs[i + 1].text.replace(/\t/g, ' ').replace(/\n/g, '<br>');
          i++;
        }
        tsv += q + '\t' + a + '\n';
      }
    }
    if (!tsv) {
      alert('Không tìm thấy cặp câu hỏi - trả lời nào để tạo thẻ Anki.');
      return;
    }
    triggerDownload(tsv, title + '_AnkiCards.txt', 'text/tab-separated-values;charset=utf-8');
  }

  function copyAllToClipboard(msgs) {
    const title = getChatTitle();
    let text = '# ' + title + '\n\n';
    msgs.forEach((m, idx) => {
      text += '### ' + (m.role === 'user' ? '👤 Câu hỏi #' + (idx + 1) : '🤖 Lời giải') + '\n\n';
      const cleanEl = cleanMathForExport(m.contentEl);
      text += cleanEl.innerText.trim() + '\n\n---\n\n';
    });

    navigator.clipboard.writeText(text).then(() => {
      showToast('✅ Đã sao chép toàn bộ ' + msgs.length + ' tin nhắn vào khay nhớ tạm!');
    });
  }

  // ==========================================
  // LẮNG NGHE LỆNH TỪ POPUP / BACKGROUND WORKER
  // ==========================================
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'PING') {
        sendResponse({ status: 'ok', version: '2.4.0' });
        return true;
      }

      if (request.action === 'GET_INFO') {
        injectMessageToolbars();
        const msgs = scanChatMessages();
        sendResponse({
          totalMessages: msgs.length,
          selectedCount: selectedMsgIndices.size,
          title: getChatTitle()
        });
        return true;
      }

      if (request.action === 'EXPORT') {
        const msgs = (request.scope === 'selected' && selectedMsgIndices.size > 0)
          ? discoveredMessages.filter(m => selectedMsgIndices.has(m.index))
          : discoveredMessages;

        if (!msgs || msgs.length === 0) {
          alert('Không tìm thấy tin nhắn nào để xuất. Vui lòng kiểm tra lại trang!');
          sendResponse({ success: false });
          return true;
        }

        executeExport(request.format, msgs);
        sendResponse({ success: true, count: msgs.length });
        return true;
      }
    });
  }

  // Khởi động
  injectMessageToolbars();

  const observer = new MutationObserver(() => {
    clearTimeout(window.__studyDebounceTimer);
    window.__studyDebounceTimer = setTimeout(injectMessageToolbars, 400);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  window.__STUDY_EXPORTER_REFRESH__ = () => {
    injectMessageToolbars();
  };

  console.log('✅ [AI Study Exporter v2.4.0] Giao diện học thuật sẵn sàng!');
})();