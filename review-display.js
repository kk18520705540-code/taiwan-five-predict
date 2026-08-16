// Vercel 网页复盘显示 - 从 GitHub 读取 review.json 自动渲染
// 用法：在网页 HTML 里 <script src="review-display.js"></script>

(function() {
    var GITHUB_RAW = "https://raw.githubusercontent.com/kk18520705540-code/taiwan-five-predict/main/review.json";
    var pp = ['萬位','千位','百位','十位','個位'];
    var cc = ['#e94560', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff8b94'];

    function fetchReview() {
        fetch(GITHUB_RAW + "?t=" + Date.now(), { cache: 'no-store' })
        .then(function(r) { return r.json(); })
        .then(function(data) {
            if (data && data.positions) {
                renderReview(data);
            } else {
                console.log('⚠️ review.json 数据格式不正确');
            }
        })
        .catch(function(e) {
            console.log('⚠️ 读取 review.json 失败:', e.message);
        });
    }

    function renderReview(data) {
        var container = document.getElementById('review-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'review-container';
            document.body.appendChild(container);
        }

        var activePos = 0;

        function buildHTML(pos) {
            var d = data.positions[pos];
            var html = '';

            html += '<div style="max-width:420px;margin:20px auto;background:linear-gradient(135deg,#0f0f1a,#1a1a2e);border:2px solid #e94560;border-radius:16px;padding:18px;color:#e0e0e0;font-family:Microsoft JhengHei,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,0.6);font-size:12px;">';

            html += '<div style="text-align:center;border-bottom:2px solid #e94560;padding-bottom:10px;margin-bottom:12px;">';
            html += '<h3 style="color:#e94560;margin:0;font-size:15px;">📊 ' + data.date + ' 復盤統計 (' + data.count + '期)</h3>';
            html += '</div>';

            // Position tabs
            html += '<div style="display:flex;gap:5px;margin-bottom:10px;flex-wrap:wrap;">';
            for (var i = 0; i < 5; i++) {
                var active = i === pos;
                html += '<div class="review-tab" data-ridx="' + i + '" style="flex:1;min-width:50px;padding:6px;background:' + (active ? 'linear-gradient(135deg,#e94560,#c73e54)' : 'rgba(255,255,255,0.05)') + ';border:1px solid ' + (active ? '#e94560' : '#333') + ';border-radius:8px;cursor:pointer;text-align:center;font-size:11px;font-weight:bold;color:' + (active ? 'white' : '#e0e0e0') + ';">' + pp[i] + '</div>';
            }
            html += '</div>';

            // Section 1: 综合峰值
            html += '<div style="background:rgba(78,205,196,0.05);border:1px solid rgba(78,205,196,0.2);border-radius:10px;padding:10px;margin-bottom:10px;">';
            html += '<div style="color:#4ecdc4;font-weight:bold;font-size:11px;margin-bottom:6px;text-align:center;">🔮 綜合峰值復盤</div>';
            html += '<div style="display:flex;justify-content:center;gap:12px;text-align:center;">';
            html += '<div><div style="font-size:9px;color:#4ecdc4;">中</div><div style="font-size:18px;font-weight:bold;color:#4ecdc4;">' + d.composite.hc + '</div></div>';
            html += '<div><div style="font-size:9px;color:#e94560;">非</div><div style="font-size:18px;font-weight:bold;color:#e94560;">' + d.composite.mc + '</div></div>';
            html += '<div><div style="font-size:9px;color:#ffe66d;">命中率</div><div style="font-size:18px;font-weight:bold;color:#ffe66d;">' + d.composite.rate + '%</div></div>';
            html += '</div>';
            html += '<div style="font-size:9px;color:#aaa;text-align:center;margin-top:4px;">連中' + d.composite.mhs + ' | 連非' + d.composite.mms + '</div>';
            html += '</div>';

            // Section 2: 推荐 + 排除
            html += '<div style="display:flex;gap:6px;margin-bottom:10px;">';

            html += '<div style="flex:1;background:rgba(78,205,196,0.05);border:1px solid rgba(78,205,196,0.2);border-radius:8px;padding:8px;text-align:center;">';
            html += '<div style="color:#4ecdc4;font-weight:bold;font-size:10px;margin-bottom:4px;">✅ 推薦5碼復盤</div>';
            html += '<div style="display:flex;justify-content:center;gap:8px;">';
            html += '<div><div style="font-size:9px;color:#4ecdc4;">中</div><div style="font-size:16px;font-weight:bold;color:#4ecdc4;">' + d.recommend.hc + '</div></div>';
            html += '<div><div style="font-size:9px;color:#e94560;">非</div><div style="font-size:16px;font-weight:bold;color:#e94560;">' + d.recommend.mc + '</div></div>';
            html += '</div>';
            html += '<div style="font-size:9px;color:#aaa;margin-top:2px;">' + d.recommend.rate + '% | 連中' + d.recommend.mhs + ' 連非' + d.recommend.mms + '</div>';
            html += '</div>';

            html += '<div style="flex:1;background:rgba(233,69,96,0.05);border:1px solid rgba(233,69,96,0.2);border-radius:8px;padding:8px;text-align:center;">';
            html += '<div style="color:#e94560;font-weight:bold;font-size:10px;margin-bottom:4px;">❌ 排除5碼復盤</div>';
            html += '<div style="display:flex;justify-content:center;gap:8px;">';
            html += '<div><div style="font-size:9px;color:#ffe66d;">中</div><div style="font-size:16px;font-weight:bold;color:#ffe66d;">' + d.exclude.hc + '</div></div>';
            html += '<div><div style="font-size:9px;color:#888;">非</div><div style="font-size:16px;font-weight:bold;color:#888;">' + d.exclude.mc + '</div></div>';
            html += '</div>';
            html += '<div style="font-size:9px;color:#aaa;margin-top:2px;">' + d.exclude.rate + '% | 連中' + d.exclude.mhs + ' 連非' + d.exclude.mms + '</div>';
            html += '</div>';

            html += '</div>';

            // Section 3: 五方案
            html += '<div style="color:#aaa;font-weight:bold;font-size:11px;margin-bottom:6px;border-top:1px solid #333;padding-top:8px;text-align:center;">🎲 五方案復盤對比</div>';
            for (var s = 0; s < 5; s++) {
                var ds = d.schemes[s];
                html += '<div style="background:rgba(0,0,0,0.2);border-radius:8px;padding:8px;margin-bottom:6px;border-left:3px solid ' + ds.color + ';">';
                html += '<div style="font-size:11px;font-weight:bold;color:' + ds.color + ';margin-bottom:4px;">' + ds.name + '</div>';
                html += '<div style="display:flex;justify-content:center;gap:12px;text-align:center;">';
                html += '<div><div style="font-size:9px;color:#4ecdc4;">中</div><div style="font-size:14px;font-weight:bold;color:#4ecdc4;">' + ds.hc + '</div></div>';
                html += '<div><div style="font-size:9px;color:#e94560;">非</div><div style="font-size:14px;font-weight:bold;color:#e94560;">' + ds.mc + '</div></div>';
                html += '<div><div style="font-size:9px;color:#ffe66d;">命中率</div><div style="font-size:14px;font-weight:bold;color:#ffe66d;">' + ds.rate + '%</div></div>';
                html += '</div>';
                html += '<div style="font-size:9px;color:#aaa;text-align:center;margin-top:2px;">連中' + ds.mhs + ' | 連非' + ds.mms + '</div>';
                html += '</div>';
            }

            html += '<div style="font-size:10px;color:#666;text-align:center;margin-top:8px;">⚠️ 統計僅供參考，彩票開獎為隨機事件</div>';
            html += '</div>';

            return html;
        }

        function updatePanel(pos) {
            container.innerHTML = buildHTML(pos);
            var tabs = container.querySelectorAll('.review-tab');
            for (var t = 0; t < tabs.length; t++) {
                tabs[t].addEventListener('click', function(e) {
                    var idx = parseInt(e.target.getAttribute('data-ridx'));
                    updatePanel(idx);
                });
            }
        }

        updatePanel(0);
    }

    // 页面加载后自动获取
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fetchReview);
    } else {
        fetchReview();
    }

    // 每 60 秒自动刷新
    setInterval(fetchReview, 60000);

    console.log('📊 Vercel 复盘显示已启动，自动读取 review.json');
})();
