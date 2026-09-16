/**
 * =========================================================================
 * 🎓 AI STUDY EXPORTER - PERFECT INLINE BUTTON & CHECKBOX ALIGNMENT
 * =========================================================================
 */

(function () {
  'use strict';

  if (window.__STUDY_EXPORTER_INITIALIZED__) {
    if (typeof window.__STUDY_EXPORTER_REFRESH__ === 'function') {
      window.__STUDY_EXPORTER_REFRESH__();
    }
    return;
  }
  window.__STUDY_EXPORTER_INITIALIZED__ = true;

  function ensureStylesInjected() {
    if (document.getElementById('study-exporter-style-sheet')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'study-exporter-style-sheet';
    styleEl.textContent = `
      /* Thẻ chứa riêng cho nút Chọn cả câu - nằm căn chỉnh hoàn hảo theo lề văn bản */
      .study-block-header {
        display: block !important;
        width: 100% !important;
        margin-bottom: 12px !important;
        padding-left: 0 !important;
        position: relative !important;
        clear: both !important;
      }

      .study-select-block-btn {
        display: inline-flex !important;
        align-items: center !important;
        gap: 4px !important;
        background: #eff6ff !important;
        color: #1d4ed8 !important;
        border: 1px solid #bfdbfe !important;
        padding: 4px 12px !important;
        border-radius: 12px !important;
        font-size: 11px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important;
        user-select: none !important;
      }
      .study-select-block-btn:hover {
        background: #dbeafe !important;
        border-color: #3b82f6 !important;
      }

      /* Phần tử chứa từng dòng văn bản */
      .study-target-el {
        position: relative !important;
        transition: background-color 0.15s ease !important;
      }
      .study-target-el[data-study-selected="true"] {
        background-color: rgba(37, 99, 235, 0.08) !important;
        border-radius: 4px !important;
      }

      /* Checkbox từng dòng đặt treo sát lề trái */
      .study-custom-cb {
        position: absolute !important;
        left: -26px !important;
        top: 4px !important;
        appearance: none !important;
        -webkit-appearance: none !important;
        width: 16px !important;
        height: 16px !important;
        border: 1.8px solid #94a3b8 !important;
        border-radius: 4px !important;
        outline: none !important;
        cursor: pointer !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: #ffffff !important;
        opacity: 0.25 !important;
        transition: all 0.18s ease !important;
        z-index: 99 !important;
      }

      .study-target-el:hover .study-custom-cb, 
      .study-custom-cb:hover {
        opacity: 1 !important;
        border-color: #2563eb !important;
      }

      .study-custom-cb:checked {
        opacity: 1 !important;
        background-color: #2563eb !important;
        border-color: #2563eb !important;
      }

      .study-custom-cb:checked::after {
        content: '' !important;
        width: 4px !important;
        height: 7px !important;
        border: solid white !important;
        border-width: 0 2px 2px 0 !important;
        transform: rotate(45deg) translate(-0.5px, -0.5px) !important;
        display: block !important;
      }

      @media (prefers-color-scheme: dark) {
        .study-select-block-btn { background: #1e3a8a !important; color: #93c5fd !important; border-color: #1d4ed8 !important; }
        .study-select-block-btn:hover { background: #1e40af !important; }
        .study-custom-cb { background: #1e293b !important; border-color: #64748b !important; }
      }

      /* Global Toolbar */
      #study-global-toolbar {
        position: fixed !important;
        bottom: 24px !important;
        right: 24px !important;
        z-index: 999999 !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        padding: 6px 10px !important;
        background: #ffffff !important;
        border: 1px solid #cbd5e1 !important;
        border-radius: 30px !important;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      }
      @media (prefers-color-scheme: dark) {
        #study-global-toolbar { background: #1e293b !important; border-color: #475569 !important; }
      }

      /* ANIMATION: Nhảy nhẹ nhàng & Bo viền đỏ nhấp nháy tạo sự chú ý */
      @keyframes studyBounce {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-8px);
        }
      }

      @keyframes studyPulseRed {
        0%, 100% {
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7), 0 8px 24px rgba(0,0,0,0.15) !important;
        }
        50% {
          border-color: #f87171 !important;
          box-shadow: 0 0 0 10px rgba(239, 68, 68, 0), 0 8px 24px rgba(0,0,0,0.15) !important;
        }
      }

      .study-attention-active {
        animation: 
          studyBounce 1.8s ease-in-out infinite,
          studyPulseRed 1.2s ease-in-out infinite !important;
        border-width: 2px !important;
      }

      .study-tb-btn {
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        padding: 7px 14px !important;
        border-radius: 20px !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        border: none !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        white-space: nowrap !important;
      }
      .study-btn-primary { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important; color: #ffffff !important; }
      .study-btn-primary:hover { background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%) !important; transform: translateY(-1px) !important; }
      .study-btn-secondary { background: #f1f5f9 !important; color: #475569 !important; }
      .study-btn-secondary:hover { background: #e2e8f0 !important; color: #0f172a !important; }
      @media (prefers-color-scheme: dark) {
        .study-btn-secondary { background: #334155 !important; color: #cbd5e1 !important; }
        .study-btn-secondary:hover { background: #475569 !important; color: #ffffff !important; }
      }
      .study-tb-dropdown {
        position: absolute !important;
        bottom: calc(100% + 10px) !important;
        right: 0 !important;
        background: #ffffff !important;
        border: 1px solid #cbd5e1 !important;
        border-radius: 12px !important;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
        padding: 6px !important;
        min-width: 180px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 4px !important;
      }
      @media (prefers-color-scheme: dark) {
        .study-tb-dropdown { background: #1e293b !important; border-color: #475569 !important; }
      }
      .study-drop-item {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        padding: 8px 12px !important;
        border-radius: 8px !important;
        font-size: 12px !important;
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
    `;
    document.head.appendChild(styleEl);
  }

  function getChatTitle() {
    let t = document.title || '';
    t = t.replace(/ - Gemini| \| ChatGPT/gi, '').trim();
    if (!t || t === 'Gemini' || t === 'ChatGPT') {
      t = 'Tai_Lieu_Hoc_Tap_' + new Date().toLocaleDateString('vi-VN').replace(/\//g, '-');
    }
    return t.replace(/[/\\?%*:|"<>]/g, '_').trim();
  }

  function extractLatexFromKatex(el) {
    if (!el) return null;
    const ann = el.querySelector('annotation[encoding*="tex"]') || el.querySelector('annotation') || el.querySelector('[data-tex]');
    if (ann && ann.textContent.trim()) return ann.textContent.trim();
    const dt = el.getAttribute('data-tex') || el.getAttribute('data-original-tex');
    return (dt && dt.trim()) ? dt.trim() : null;
  }

  async function convertImgToBase64(imgUrl) {
    if (!imgUrl || imgUrl.startsWith('data:image')) return imgUrl;
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => resolve(imgUrl);
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      return imgUrl;
    }
  }

  function injectLineCheckboxes() {
    const allContainers = Array.from(document.querySelectorAll('model-response, [data-message-author-role="assistant"], .markdown'));
    const responseContainers = allContainers.filter(el => !el.querySelector('model-response, [data-message-author-role="assistant"], .markdown'));
    
    responseContainers.forEach((container) => {
      // Xóa header cũ nếu có
      container.querySelectorAll('.study-block-header').forEach(h => h.remove());

      // Tạo header chứa nút bấm riêng biệt
      const blockHeader = document.createElement('div');
      blockHeader.className = 'study-block-header';

      const quickBtn = document.createElement('button');
      quickBtn.className = 'study-select-block-btn';
      quickBtn.innerHTML = '✓ Chọn cả câu này';
      
      quickBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const checkboxes = container.querySelectorAll('.study-custom-cb');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        
        checkboxes.forEach(cb => {
          cb.checked = !allChecked;
          const targetEl = cb.closest('.study-target-el');
          if (targetEl) {
            if (!allChecked) targetEl.setAttribute('data-study-selected', 'true');
            else targetEl.removeAttribute('data-study-selected');
          }
        });
        quickBtn.innerHTML = allChecked ? '✓ Chọn cả câu này' : '✕ Bỏ chọn câu này';
      });

      blockHeader.appendChild(quickBtn);

      // Chèn header vào đúng vị trí đầu tiên của khối câu trả lời
      if (container.firstChild) {
        container.insertBefore(blockHeader, container.firstChild);
      } else {
        container.appendChild(blockHeader);
      }

      // Đặt Checkbox vào từng dòng chữ
      const elements = container.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, table, pre, .katex-display, figure');

      elements.forEach((el) => {
        if (el.classList.contains('study-target-el') || el.querySelector('.study-custom-cb')) return;

        el.classList.add('study-target-el');

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.className = 'study-custom-cb';

        cb.addEventListener('change', (e) => {
          e.stopPropagation();
          if (cb.checked) el.setAttribute('data-study-selected', 'true');
          else el.removeAttribute('data-study-selected');
        });

        el.insertBefore(cb, el.firstChild);
      });
    });
  }

  function renderGlobalToolbar() {
    if (document.getElementById('study-global-toolbar')) return;

    const toolbar = document.createElement('div');
    toolbar.id = 'study-global-toolbar';

    // Thêm class kích hoạt hiệu ứng gây chú ý
    toolbar.classList.add('study-attention-active');

    toolbar.innerHTML = `
      <button class="study-tb-btn study-btn-primary" id="study-export-trigger">
        ⚡ <span>Xuất Bài Học</span> ▾
      </button>
      <button class="study-tb-btn study-btn-secondary" id="study-uncheck-trigger" title="Bỏ tích tất cả">
        🔄 <span>Bỏ tích</span>
      </button>
    `;

    document.body.appendChild(toolbar);

    // Tự động gỡ bỏ hiệu ứng sau đúng 1 phút (60.000ms)
    setTimeout(() => {
      toolbar.classList.remove('study-attention-active');
    }, 60000);

    document.getElementById('study-uncheck-trigger').addEventListener('click', () => {
      document.querySelectorAll('.study-custom-cb').forEach(cb => {
        cb.checked = false;
        const targetEl = cb.closest('.study-target-el');
        if (targetEl) targetEl.removeAttribute('data-study-selected');
      });
      document.querySelectorAll('.study-select-block-btn').forEach(btn => {
        btn.innerHTML = '✓ Chọn cả câu này';
      });
    });

    document.getElementById('study-export-trigger').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleExportMenu(toolbar);
    });
  }

  function toggleExportMenu(parentEl) {
    const existingMenu = parentEl.querySelector('.study-tb-dropdown');
    if (existingMenu) {
      existingMenu.remove();
      return;
    }

    const menu = document.createElement('div');
    menu.className = 'study-tb-dropdown';

    const options = [
      { id: 'word', icon: '📝', label: 'Xuất File Word (.doc)' },
      { id: 'md', icon: '📜', label: 'Xuất Markdown (.md)' }
    ];

    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'study-drop-item';
      btn.innerHTML = `<span>${opt.icon}</span><span>${opt.label}</span>`;
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const btnText = parentEl.querySelector('#study-export-trigger span');
        btnText.textContent = 'Đang xử lý tài liệu...';
        menu.remove();
        await executeGlobalExport(opt.id);
        btnText.textContent = 'Xuất Bài Học';
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

  async function prepareExportDOM() {
    const selectedElements = document.querySelectorAll('.study-target-el[data-study-selected="true"]');
    const container = document.createElement('div');

    if (selectedElements.length > 0) {
      selectedElements.forEach(el => {
        const clone = el.cloneNode(true);
        clone.querySelectorAll('.study-custom-cb').forEach(cb => cb.remove());
        container.appendChild(clone);
      });
    } else {
      const allC = Array.from(document.querySelectorAll('model-response, [data-message-author-role="assistant"], .markdown'));
      const responses = allC.filter(el => !el.querySelector('model-response, [data-message-author-role="assistant"], .markdown'));
      
      responses.forEach(res => {
        const clone = res.cloneNode(true);
        clone.querySelectorAll('.study-custom-cb, .study-block-header').forEach(el => el.remove());
        container.appendChild(clone);
      });
    }

    container.querySelectorAll('button.image-button, button').forEach(btn => {
      const img = btn.querySelector('img');
      if (img) {
        btn.replaceWith(img);
      } else if (!btn.closest('.study-global-toolbar')) {
        btn.remove();
      }
    });

    container.querySelectorAll('svg, [aria-label*="Download"], [aria-label*="Share"], .action-bar, .overlay').forEach(el => el.remove());

    const images = Array.from(container.querySelectorAll('img'));
    for (const img of images) {
      const src = img.src || img.getAttribute('src');
      const altText = img.getAttribute('alt') || '';
      
      if (src && !src.includes('avatar') && !src.includes('icon')) {
        const base64Data = await convertImgToBase64(src);
        img.src = base64Data;
      }

      img.removeAttribute('class');
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.display = 'block';
      img.style.margin = '15px auto';
      img.style.borderRadius = '8px';
      img.style.boxShadow = '0 4px 10px rgba(0,0,0,0.12)';

      if (altText && altText.length > 10) {
        const caption = document.createElement('div');
        caption.style.textAlign = 'center';
        caption.style.fontSize = '10.5pt';
        caption.style.color = '#555';
        caption.style.fontStyle = 'italic';
        caption.style.margin = '5px 0 15px 0';
        caption.innerText = '📌 ' + altText;
        img.after(caption);
      }
    }

    container.querySelectorAll('.katex-display').forEach(kd => {
      const tex = extractLatexFromKatex(kd);
      if (tex) { const p = document.createElement('p'); p.textContent = '$$ ' + tex + ' $$'; kd.replaceWith(p); }
    });
    container.querySelectorAll('.katex').forEach(k => {
      if (k.closest('.katex-display')) return;
      const tex = extractLatexFromKatex(k);
      if (tex) { const span = document.createElement('span'); span.textContent = ' $' + tex + '$ '; k.replaceWith(span); }
    });

    return container;
  }

  function triggerDownload(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { if (a.parentNode) a.parentNode.removeChild(a); URL.revokeObjectURL(url); }, 2000);
  }

  async function executeGlobalExport(format) {
    const exportDOM = await prepareExportDOM();
    const title = getChatTitle();

    if (format === 'word') {
      const docHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${title}</title>
<style>
  body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; color: #111; }
  table { border-collapse: collapse; width: 100%; margin: 15pt 0; }
  th, td { border: 1pt solid #cbd5e1; padding: 8pt; text-align: left; }
  th { background-color: #f8fafc; }
  img { max-width: 100%; height: auto; display: block; margin: 15px auto; border-radius: 8px; }
</style>
</head>
<body>
  <h2 style="text-align: center; color: #1e293b;">${title}</h2>
  ${exportDOM.innerHTML}
</body></html>`;
      triggerDownload('\uFEFF' + docHtml, title + '.doc', 'application/msword;charset=utf-8');
    } 
    else if (format === 'md') {
      exportDOM.querySelectorAll('img').forEach(img => {
        const src = img.src || img.getAttribute('src') || '';
        const alt = img.alt || 'Hình ảnh bài học';
        const p = document.createElement('p');
        p.textContent = `\n![${alt}](${src})\n`;
        img.replaceWith(p);
      });

      const md = `# ${title}\n\n` + exportDOM.innerText.trim();
      triggerDownload(md, title + '.md', 'text/markdown;charset=utf-8');
    }
  }

  function init() {
    ensureStylesInjected();
    injectLineCheckboxes();
    renderGlobalToolbar();
  }

  init();
  const observer = new MutationObserver(() => {
    clearTimeout(window.__studyDebounceTimer);
    window.__studyDebounceTimer = setTimeout(init, 500);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.__STUDY_EXPORTER_REFRESH__ = init;
})();