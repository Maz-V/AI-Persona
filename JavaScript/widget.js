(function() {
    // ==============================================================================================
    // Copyright (c) 2025 Moch. Luthfi Rahmadi. Maz-V Corporation. All rights reserved.
    // Maz-V AI Persona Widget
    // Versi 1.0.7
    // ==============================================================================================
    // Konfigurasi widget, bisa di-set sebelum load script
    var personaId = window.MazviWidgetPersonaId || null;
    var avatar = window.MazviWidgetAvatar || 'https://ai.mazvi.com/persona/avatar-mazvi.jpg';
    var nama = window.MazviWidgetNama || 'Tanya AI';
    var chatUrl = window.MazviWidgetChatUrl || ('https://ai.mazvi.com/persona/?id=' + encodeURIComponent(personaId));
    // Tambahan konfigurasi posisi
    var position = (window.MazviWidgetPosition === 'left') ? 'left' : 'right'; // default 'right'
    var bottom = (typeof window.MazviWidgetBottom === 'number') ? window.MazviWidgetBottom : 24; // default 24px

    // CSS untuk widget
    var style = document.createElement('style');
    style.innerHTML = `
    .mazvi-widget-btn {
        position: fixed;
        /* right/bottom diatur inline */
        z-index: 999999;
        background: #fff;
        border-radius: 24px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.12);
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 6px 14px 6px 6px;
        border: none;
        transition: box-shadow 0.2s;
    }
    .mazvi-widget-btn:hover {
        box-shadow: 0 4px 24px rgba(0,0,0,0.18);
    }
    .mazvi-widget-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 8px;
        border: 1px solid #eee;
    }
    .mazvi-widget-label {
        font-size: 1em;
        color: #222;
        font-weight: bold;
        margin-right: 4px;
    }
    .mazvi-widget-iframe-wrap {
        position: fixed;
        /* right/bottom diatur inline */
        z-index: 999999;
        width: 370px;
        max-width: 98vw;
        height: 540px;
        max-height: 80vh;
        background: #fff;
        border-radius: 18px;
        box-shadow: 0 4px 32px rgba(0,0,0,0.18);
        display: none;
        flex-direction: column;
        overflow: visible;
        border: 1px solid #eee;
        animation: mazvi-fadein 0.2s;
    }
    @keyframes mazvi-fadein {
        from { opacity: 0; transform: translateY(30px);}
        to { opacity: 1; transform: translateY(0);}
    }
    .mazvi-widget-iframe-close-outer {
        position: absolute;
        top: -18px;
        right: -18px;
        z-index: 1000000;
        background: #e74c3c;
        color: #fff;
        border: none;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        font-size: 1.5em;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.18);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
    }
    .mazvi-widget-iframe-close-outer:hover {
        background: #c0392b;
    }
    @media (max-width: 500px) {
        .mazvi-widget-iframe-wrap {
            width: 100% !important;
            height: 100% !important;
            max-height: 100% !important;
            max-width: 100% !important;
            left: 0 !important;
            right: 0 !important;
            top: 0 !important;
            bottom: 0 !important;
            border-radius: 0;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        .mazvi-widget-iframe-wrap iframe {
            width: 100% !important;
            height: 100% !important;
            border-radius: 0;
            position: absolute;
            top: 0;
            left: 0;
        }
        .mazvi-widget-iframe-close-outer {
            top: 50px !important;
            right: 20px !important;
            left: auto !important;
            width: 40px;
            height: 40px;
            font-size: 1.4em;
            z-index: 1000001;
        }
        .mazvi-widget-btn {
            max-width: calc(100vw - 32px);
            /* Position is now controlled by the inline styles just like on desktop */
        }
    }
    `;
    document.head.appendChild(style);

    // Tombol widget
    var btn = document.createElement('button');
    btn.className = 'mazvi-widget-btn';
    btn.innerHTML = `
        <img class="mazvi-widget-avatar" src="${avatar}" alt="AI">
        <span class="mazvi-widget-label">${nama}</span>
    `;
    // Atur posisi tombol secara dinamis
    btn.style[position] = '24px';
    btn.style.bottom = bottom + 'px';
    // Hapus sisi seberangnya agar tidak bentrok
    if (position === 'right') btn.style.left = 'unset';
    else btn.style.right = 'unset';
    document.body.appendChild(btn);

    // Kotak chat (iframe)
    var wrap = document.createElement('div');
    wrap.className = 'mazvi-widget-iframe-wrap';
    wrap.innerHTML = `
        <iframe src="" frameborder="0" style="width:100%;height:100%;border:none;display:block;background:#fff;border-radius:18px;"></iframe>
    `;
    // Atur posisi chat box secara dinamis
    wrap.style[position] = '24px';
    wrap.style.bottom = (bottom + 56) + 'px'; // 56px di atas tombol (tinggi tombol + margin)
    if (position === 'right') wrap.style.left = 'unset';
    else wrap.style.right = 'unset';
    document.body.appendChild(wrap);

    // Tombol close di luar iframe
    var closeBtn = document.createElement('button');
    closeBtn.className = 'mazvi-widget-iframe-close-outer';
    closeBtn.title = 'Tutup';
    closeBtn.innerHTML = '&times;';
    wrap.appendChild(closeBtn);

    var iframe = wrap.querySelector('iframe');

    // Set iframe src saat tombol diklik
    btn.addEventListener('click', function() {
        iframe.src = chatUrl;
        wrap.style.display = 'flex';
    });

    // Tutup widget
    closeBtn.addEventListener('click', function() {
        wrap.style.display = 'none';
        iframe.src = '';
    });

    // Klik di luar iframe untuk tutup (opsional)
    // document.addEventListener('mousedown', function(e) {
    //     if (wrap.style.display === 'flex' && !wrap.contains(e.target) && !btn.contains(e.target)) {
    //         wrap.style.display = 'none';
    //         iframe.src = '';
    //     }
    // });
    //
    // ==============================================================================================
    // Copyright (c) 2025 Moch. Luthfi Rahmadi. Maz-V Corporation. All rights reserved.
    // Maz-V AI Persona Widget
    // Versi 1.0.7
    // ==============================================================================================
})();