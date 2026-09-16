/**
 * =========================================================================
 * 🎓 AI STUDY EXPORTER - SCIENTIFIC CONSOLE INJECTOR v2.4.0
 * =========================================================================
 * Tiêm công cụ trích xuất học thuật vào Google Gemini & ChatGPT:
 * - Bảo toàn 100% công thức Toán KaTeX/LaTeX, Bảng biểu & Code
 * - Giao diện thanh lịch, chuẩn tài liệu nghiên cứu khoa học
 * - Xuất PDF A4 không bị chặn popup, Word .doc, Markdown, HTML & LaTeX
 * =========================================================================
 */

(function () {
  'use strict';

  console.log('🎓 [AI Study Exporter v2.4.0] Đang khởi động thanh công cụ học thuật...');

  // 1. Tiêm CSS Giao diện Khoa học & Tương thích Dark/Light Theme
  const STYLE_ID = 'study-exporter-scientific-style';
  let styleEl = document.getElementById(STYLE_ID);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    styleEl.textContent = `
      .study-turn-selected {
        position: relative !important;
        border-left: 3.5px solid #2563eb !important;
        background-color: rgba(37, 99, 235, 0.025) !important;
        border-radius: 4px 8px 8px 4px !important;
        padding-left: 10px !important;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        box-sizing: border-box !important;
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
        max-width: 100% !important;
        clear: both !important;
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
        margin: 6px 0 12px 0 !important;
        padding: 4px 0 6px 0 !important;
        border-bottom: 1px dashed rgba(203, 213, 225, 0.7) !important;
        background: transparent !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        font-size: 12px !important;
        color: #475569 !important;
        width: 100% !important;
        max-width: 100% !important;
        clear: both !important;
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
      #study-float-dock {
        position: fixed !important;
        bottom: 24px !important;
        right: 24px !important;
        z-index: 2147483640 !important;
        background: rgba(255, 255, 255, 0.94) !important;
        backdrop-filter: blur(16px) !important;
        -webkit-backdrop-filter: blur(16px) !important;
        border: 1.5px solid rgba(203, 213, 225, 0.9) !important;
        border-radius: 16px !important;
        padding: 8px 12px !important;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04) !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 6px !important;
        min-width: 260px !important;
        max-width: 320px !important;
        opacity: 0.92 !important;
        transition: opacity 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease !important;
        user-select: none !important;
      }
      #study-float-dock:hover {
        opacity: 1 !important;
        box-shadow: 0 16px 40px rgba(15, 23, 42, 0.18), 0 4px 12px rgba(0, 0, 0, 0.08) !important;
      }
      #study-float-dock.minimized {
        min-width: unset !important;
        max-width: fit-content !important;
        padding: 6px 10px !important;
        border-radius: 9999px !important;
        gap: 0 !important;
        cursor: move !important;
      }
      #study-float-dock.minimized .dock-body, #study-float-dock.minimized .dock-footer { display: none !important; }
      #study-float-dock.study-dock-hidden { display: none !important; }
      @media (prefers-color-scheme: dark) {
        #study-float-dock { background: rgba(15, 23, 42, 0.92) !important; border-color: #334155 !important; box-shadow: 0 12px 36px rgba(0,0,0,0.5) !important; }
      }
      .dock-header { display: flex !important; align-items: center !important; justify-content: space-between !important; cursor: grab !important; gap: 8px !important; padding: 2px 0 !important; }
      .dock-header:active { cursor: grabbing !important; }
      .dock-brand { display: inline-flex !important; align-items: center !important; gap: 5px !important; font-weight: 700 !important; font-size: 12px !important; color: #0f172a !important; pointer-events: none !important; }
      @media (prefers-color-scheme: dark) { .dock-brand { color: #f8fafc !important; } }
      .dock-badge { background: #eff6ff !important; color: #1d4ed8 !important; font-size: 10.5px !important; font-weight: 600 !important; padding: 1.5px 6.5px !important; border-radius: 12px !important; border: 1px solid #dbeafe !important; white-space: nowrap !important; }
      @media (prefers-color-scheme: dark) { .dock-badge { background: #1e3a8a !important; color: #93c5fd !important; border-color: #1d4ed8 !important; } }
      .dock-ctrl-btns { display: flex !important; align-items: center !important; gap: 2px !important; }
      .dock-ctrl-btn { background: transparent !important; border: none !important; color: #64748b !important; font-size: 13px !important; font-weight: 700 !important; cursor: pointer !important; padding: 2px 5px !important; line-height: 1 !important; border-radius: 4px !important; transition: all 0.15s ease !important; }
      .dock-ctrl-btn:hover { background: #f1f5f9 !important; color: #0f172a !important; }
      @media (prefers-color-scheme: dark) { .dock-ctrl-btn:hover { background: #334155 !important; color: #f8fafc !important; } }
      
      #study-dock-edge-trigger {
        position: fixed !important;
        right: 0 !important;
        bottom: 120px !important;
        z-index: 2147483640 !important;
        background: #2563eb !important;
        color: #ffffff !important;
        border-radius: 8px 0 0 8px !important;
        padding: 8px 6px !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 4px !important;
        box-shadow: -2px 4px 14px rgba(37, 99, 235, 0.35) !important;
        cursor: pointer !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        font-size: 11px !important;
        font-weight: 700 !important;
        transition: transform 0.2s ease, background 0.15s ease !important;
        user-select: none !important;
      }
      #study-dock-edge-trigger:hover { background: #1d4ed8 !important; transform: translateX(-3px) !important; }
      #study-dock-edge-trigger .edge-badge { background: #ffffff !important; color: #2563eb !important; font-size: 9.5px !important; font-weight: 800 !important; padding: 1px 4px !important; border-radius: 6px !important; }
      
      .dock-actions-grid { display: grid !important; grid-template-columns: 1fr 1fr 1fr !important; gap: 6px !important; }
      .dock-btn { display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; gap: 2px !important; padding: 6px 4px !important; border-radius: 8px !important; font-size: 11px !important; font-weight: 700 !important; cursor: pointer !important; border: 1px solid transparent !important; text-align: center !important; transition: all 0.15s ease !important; white-space: nowrap !important; }
      .dock-btn-icon { font-size: 14px !important; }
      .dock-btn-pdf { background: #eff6ff !important; border-color: #bfdbfe !important; color: #1d4ed8 !important; }
      .dock-btn-pdf:hover { background: #2563eb !important; color: #ffffff !important; border-color: #2563eb !important; }
      .dock-btn-word { background: #f0fdf4 !important; border-color: #bbf7d0 !important; color: #15803d !important; }
      .dock-btn-word:hover { background: #16a34a !important; color: #ffffff !important; border-color: #16a34a !important; }
      .dock-btn-more { background: #f8fafc !important; border-color: #cbd5e1 !important; color: #334155 !important; }
      .dock-btn-more:hover { background: #e2e8f0 !important; color: #0f172a !important; }
      @media (prefers-color-scheme: dark) {
        .dock-btn-pdf { background: #1e3a8a !important; border-color: #2563eb !important; color: #bfdbfe !important; }
        .dock-btn-pdf:hover { background: #2563eb !important; color: #fff !important; }
        .dock-btn-word { background: #14532d !important; border-color: #16a34a !important; color: #bbf7d0 !important; }
        .dock-btn-word:hover { background: #16a34a !important; color: #fff !important; }
        .dock-btn-more { background: #1e293b !important; border-color: #475569 !important; color: #e2e8f0 !important; }
        .dock-btn-more:hover { background: #334155 !important; }
      }
      .dock-footer { display: flex !important; align-items: center !important; justify-content: space-between !important; padding-top: 6px !important; border-top: 1px solid #f1f5f9 !important; font-size: 11px !important; }
      @media (prefers-color-scheme: dark) { .dock-footer { border-color: #1e293b !important; } }
      .dock-link { background: transparent !important; border: none !important; color: #64748b !important; cursor: pointer !important; font-size: 11px !important; padding: 0 !important; }
      .dock-link:hover { color: #2563eb !important; text-decoration: underline !important; }
      
      #study-toast {
        position: fixed !important;
        top: 20px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        right: auto !important;
        bottom: auto !important;
        background: #0f172a !important;
        color: #ffffff !important;
        padding: 8px 16px !important;
        border-radius: 9999px !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        box-shadow: 0 10px 25px rgba(0,0,0,0.25) !important;
        border: 1px solid rgba(255, 255, 255, 0.15) !important;
        z-index: 2147483647 !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        max-width: 90vw !important;
        pointer-events: none !important;
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

  const IS_GEMINI = window.location.hostname.includes('gemini.google.com');
  const selectedMsgIndices = new Set();
  let discoveredMessages = [];

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

  function scanChatMessages() {
    const list = [];
    if (IS_GEMINI) {
      let turns = Array.from(document.querySelectorAll('user-query, model-response, .chat-turn, [data-test-id*="turn"], ms-cmark-node'));
      if (turns.length === 0) turns = Array.from(document.querySelectorAll('message-content, .model-response-text, .response-container'));
      if (turns.length === 0) turns = Array.from(document.querySelectorAll('.markdown, [role="region"]'));

      turns.forEach((turn, idx) => {
        if (turn.closest('#study-float-dock') || turn.closest('#study-modal-overlay')) return;
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
      // 🟢 QUÉT TIN NHẮN CHATGPT (TỐI ƯU HÓA HOÀN TOÀN)
      // =====================================
      let rawTurns = Array.from(document.querySelectorAll('article'));
      if (rawTurns.length === 0) {
        rawTurns = Array.from(document.querySelectorAll('[data-message-author-role]'));
      }
      if (rawTurns.length === 0) {
        rawTurns = Array.from(document.querySelectorAll('[data-testid^="conversation-turn-"], .text-message'));
      }

      // Khử trùng lặp
      const turns = rawTurns.filter((el, idx, arr) => {
        if (el.closest('#study-float-dock') || el.closest('#study-modal-overlay')) return false;
        return !arr.some(other => other !== el && other.contains(el));
      });

      turns.forEach((turn, idx) => {
        if (list.some(item => item.el === turn)) return;

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

  function injectMessageToolbars() {
    const msgs = scanChatMessages();

    msgs.forEach((item) => {
      item.el.querySelectorAll('.study-msg-bar').forEach(el => el.remove());

      const target = item.insertionTarget || item.el;
      const targetParent = target.parentNode || item.el;
      const vContainer = item.visualContainer || item.el;

      if (item.role === 'user') {
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
        let assistantBar = (targetParent && targetParent.querySelector(':scope > .study-assistant-bar')) || item.el.querySelector('.study-assistant-bar');
        if (!assistantBar) {
          assistantBar = document.createElement('div');
          assistantBar.className = 'study-assistant-bar';

          const metaBox = document.createElement('div');
          metaBox.className = 'study-bar-meta';

          let metaPieces = [];
          if (item.mathCount > 0) metaPieces.push('📐 ' + item.mathCount + ' công thức');
          if (item.tableCount > 0) metaPieces.push('📊 ' + item.tableCount + ' bảng');
          if (item.codeCount > 0) metaPieces.push('💻 ' + item.codeCount + ' mã');
          if (metaPieces.length === 0) metaPieces.push('📖 Lời giải chi tiết');

          metaBox.innerHTML = metaPieces.join(' <span class="study-meta-dot">•</span> ');
          assistantBar.appendChild(metaBox);

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

          const quickBtn = document.createElement('button');
          quickBtn.className = 'study-sub-btn';
          quickBtn.innerHTML = '⚡ Xuất ▾';
          quickBtn.title = 'Xuất riêng đoạn tin nhắn này';
          quickBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openQuickMenu(actionsBox, item);
          });
          actionsBox.appendChild(quickBtn);

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

    updateFloatingDockCount();
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

    updateFloatingDockCount();
  }

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

      showToast('✅ Đã xuất thành công: <strong>' + filename + '</strong>');
    } catch (err) {
      console.error('Lỗi khi tải file:', err);
      try {
        const a = document.createElement('a');
        a.href = 'data:' + mimeType + ',' + encodeURIComponent(content);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => a.remove(), 1500);
        showToast('✅ Đã tải file: <strong>' + filename + '</strong>');
      } catch (e2) {
        alert('Trình duyệt chặn tải tự động. Vui lòng thử lại hoặc chọn sao chép nội dung.');
      }
    }
  }

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

  function updateFloatingDockCount() {
    const count = selectedMsgIndices.size;
    const total = discoveredMessages.length;
    const countText = count > 0 ? (count + ' / ' + total + ' đoạn') : ('Tất cả ' + total + ' đoạn');

    const badge = document.getElementById('study-dock-count-badge');
    if (badge) badge.textContent = countText;

    const edgeBadge = document.getElementById('study-edge-badge');
    if (edgeBadge) edgeBadge.textContent = count > 0 ? count : total;
  }

  function injectFloatingBar() {
    let dock = document.getElementById('study-float-dock');
    if (dock) dock.remove();

    let edgeTrigger = document.getElementById('study-dock-edge-trigger');
    if (edgeTrigger) edgeTrigger.remove();

    // 1. Tạo Edge Trigger (khi dock bị ẩn để không che chữ)
    edgeTrigger = document.createElement('div');
    edgeTrigger.id = 'study-dock-edge-trigger';
    edgeTrigger.title = 'Nhấp để mở bảng xuất AI Study';
    edgeTrigger.style.display = 'none';
    edgeTrigger.innerHTML = `
      <span>🎓</span>
      <span style="writing-mode:vertical-rl;text-orientation:mixed;letter-spacing:1px;font-size:10px;margin:2px 0;">XUẤT</span>
      <span id="study-edge-badge" class="edge-badge">0</span>
    `;
    document.body.appendChild(edgeTrigger);

    // 2. Tạo Dock chính
    dock = document.createElement('div');
    dock.id = 'study-float-dock';

    dock.innerHTML = `
      <div class="dock-header" id="study-dock-drag-handle" title="Nhấp giữ để di chuyển vị trí dock">
        <div class="dock-brand">
          <span>🎓</span>
          <span>AI Study</span>
        </div>
        <div style="display:flex;align-items:center;gap:4px;">
          <span id="study-dock-count-badge" class="dock-badge">Quét xong</span>
          <div class="dock-ctrl-btns">
            <button id="study-dock-min-btn" class="dock-ctrl-btn" title="Thu nhỏ/Mở rộng">_</button>
            <button id="study-dock-close-btn" class="dock-ctrl-btn" title="Ẩn thanh dock (gắn vào mép màn hình)">✕</button>
          </div>
        </div>
      </div>

      <div class="dock-body">
        <div class="dock-actions-grid">
          <button class="dock-btn dock-btn-pdf" id="dock-btn-pdf" title="Mở bản in A4 & Lưu PDF trực tiếp">
            <span class="dock-btn-icon">📄</span>
            <span>Xuất PDF (A4)</span>
          </button>
          <button class="dock-btn dock-btn-word" id="dock-btn-word" title="Tải file Word giữ bảng biểu và công thức">
            <span class="dock-btn-icon">📝</span>
            <span>Xuất Word</span>
          </button>
          <button class="dock-btn dock-btn-more" id="dock-btn-more" title="Mở thêm định dạng: Markdown, HTML, LaTeX...">
            <span class="dock-btn-icon">✨</span>
            <span>Khác ▾</span>
          </button>
        </div>
      </div>

      <div class="dock-footer">
        <button class="dock-link" id="dock-select-all">☑ Chọn tất cả</button>
        <span style="color:#cbd5e1">•</span>
        <button class="dock-link" id="dock-deselect-all">⬜ Bỏ chọn</button>
        <span style="color:#cbd5e1">•</span>
        <button class="dock-link" id="dock-rescan">🔄 Quét lại</button>
      </div>
    `;

    document.body.appendChild(dock);

    // Kéo thả Dock tự do (Draggable) để tránh che bất kỳ nội dung nào
    const dragHandle = dock.querySelector('#study-dock-drag-handle');
    let isDragging = false;
    let startX = 0, startY = 0, initLeft = 0, initTop = 0;

    dragHandle.addEventListener('mousedown', (e) => {
      if (e.target.closest('.dock-ctrl-btn') || e.target.closest('.dock-badge')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = dock.getBoundingClientRect();
      initLeft = rect.left;
      initTop = rect.top;
      dock.style.transition = 'none';
      dock.style.bottom = 'auto';
      dock.style.right = 'auto';
      dock.style.left = initLeft + 'px';
      dock.style.top = initTop + 'px';

      function onMouseMove(ev) {
        if (!isDragging) return;
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        const newLeft = Math.max(6, Math.min(window.innerWidth - dock.offsetWidth - 6, initLeft + dx));
        const newTop = Math.max(6, Math.min(window.innerHeight - dock.offsetHeight - 6, initTop + dy));
        dock.style.left = newLeft + 'px';
        dock.style.top = newTop + 'px';
      }

      function onMouseUp() {
        isDragging = false;
        dock.style.transition = '';
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      }

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });

    document.getElementById('dock-btn-pdf').addEventListener('click', () => executeExport('pdf'));
    document.getElementById('dock-btn-word').addEventListener('click', () => executeExport('word'));
    document.getElementById('dock-btn-more').addEventListener('click', openExportModal);

    document.getElementById('dock-select-all').addEventListener('click', () => {
      discoveredMessages.forEach(m => selectedMsgIndices.add(m.index));
      injectMessageToolbars();
      showToast('✅ Đã chọn tất cả ' + discoveredMessages.length + ' tin nhắn');
    });

    document.getElementById('dock-deselect-all').addEventListener('click', () => {
      selectedMsgIndices.clear();
      injectMessageToolbars();
      showToast('⬜ Đã bỏ chọn tất cả');
    });

    document.getElementById('dock-rescan').addEventListener('click', () => {
      injectMessageToolbars();
      showToast('🔄 Đã quét lại danh sách tin nhắn');
    });

    // Thu nhỏ / Bung rộng
    const minBtn = document.getElementById('study-dock-min-btn');
    minBtn.addEventListener('click', () => {
      dock.classList.toggle('minimized');
      minBtn.textContent = dock.classList.contains('minimized') ? '▢' : '_';
    });

    // Ẩn dock hoàn toàn (gắn vào mép màn hình dạng Edge Trigger)
    const closeBtn = document.getElementById('study-dock-close-btn');
    closeBtn.addEventListener('click', () => {
      dock.classList.add('study-dock-hidden');
      edgeTrigger.style.display = 'flex';
      showToast('💡 Đã thu gọn thanh xuất vào mép phải màn hình!');
    });

    edgeTrigger.addEventListener('click', () => {
      dock.classList.remove('study-dock-hidden');
      edgeTrigger.style.display = 'none';
    });

    updateFloatingDockCount();
  }

  function openExportModal() {
    let overlay = document.getElementById('study-modal-overlay');
    if (overlay) overlay.remove();

    overlay = document.createElement('div');
    overlay.id = 'study-modal-overlay';

    overlay.innerHTML = `
      <div class="study-dialog-card">
        <div class="dialog-header">
          <h3 class="dialog-title">🎓 Chọn Định Dạng Xuất Học Thuật</h3>
          <button class="dialog-close" id="dialog-close-btn">&times;</button>
        </div>
        <p style="font-size:12px;color:#64748b;margin:0 0 14px 0;">
          Phạm vi: <strong>${selectedMsgIndices.size > 0 ? ('Đã chọn ' + selectedMsgIndices.size + ' đoạn') : 'Toàn bộ cuộc trò chuyện'}</strong>.
        </p>

        <div class="dialog-grid">
          <div class="format-option" data-fmt="pdf">
            <div class="fmt-head"><span>📄</span> In & Lưu PDF (A4)</div>
            <div class="fmt-desc">Chuẩn lề A4, KaTeX sắc nét, không bị popup chặn.</div>
          </div>

          <div class="format-option" data-fmt="word">
            <div class="fmt-head"><span>📝</span> Microsoft Word (.doc)</div>
            <div class="fmt-desc">Giữ bảng biểu có viền chuẩn, công thức Cambria Math.</div>
          </div>

          <div class="format-option" data-fmt="md">
            <div class="fmt-head"><span>📜</span> Markdown (.md)</div>
            <div class="fmt-desc">Bảo toàn công thức $...$, bảng biểu, chuẩn Obsidian & Notion.</div>
          </div>

          <div class="format-option" data-fmt="html">
            <div class="fmt-head"><span>🌐</span> Web Độc Lập (.html)</div>
            <div class="fmt-desc">Mở xem offline trên máy tính/điện thoại, tích hợp KaTeX.</div>
          </div>

          <div class="format-option" data-fmt="latex">
            <div class="fmt-head"><span>🧮</span> LaTeX Source (.tex)</div>
            <div class="fmt-desc">Mã nguồn LaTeX chuẩn gói amsmath cho Overleaf.</div>
          </div>

          <div class="format-option" data-fmt="anki">
            <div class="fmt-head"><span>🗂️</span> Thẻ Ghi Nhớ Anki (.txt)</div>
            <div class="fmt-desc">Tự động ghép Câu hỏi - Trả lời thành flashcards.</div>
          </div>
        </div>

        <div style="margin-top:14px;padding-top:12px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;">
          <button id="dialog-copy-all" style="background:#f1f5f9;border:1px solid #cbd5e1;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;color:#334155;">📋 Chép toàn bộ vào Clipboard</button>
          <span style="font-size:11px;color:#94a3b8;">AI Study Exporter v2.4</span>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('dialog-close-btn').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });

    overlay.querySelectorAll('.format-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const fmt = opt.getAttribute('data-fmt');
        overlay.remove();
        executeExport(fmt);
      });
    });

    document.getElementById('dialog-copy-all').addEventListener('click', () => {
      overlay.remove();
      executeExport('copy');
    });
  }

  // Khởi động
  injectFloatingBar();
  injectMessageToolbars();

  const observer = new MutationObserver(() => {
    clearTimeout(window.__studyDebounceTimer);
    window.__studyDebounceTimer = setTimeout(injectMessageToolbars, 400);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  window.__STUDY_EXPORTER_REFRESH__ = () => {
    injectFloatingBar();
    injectMessageToolbars();
  };

  showToast('🎓 [AI Study Exporter v2.4.0] Đã gắn thanh công cụ học thuật thành công!');
})();
