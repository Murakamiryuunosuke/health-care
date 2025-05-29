// Health Book Platform JavaScript
// AI技術と専門家サポートを融合した健康管理プラットフォーム

document.addEventListener('DOMContentLoaded', function() {
    console.log('Health Book プラットフォームが読み込まれました');
    initializeApp();
});

function initializeApp() {
    // アニメーション効果の初期化
    animateOnScroll();
    
    // リアルタイムデータ更新のシミュレーション
    updateHealthData();
    
    // ユーザーインターフェースの初期化
    initializeInteractions();
}

// 健康記録機能
function openHealthRecord() {
    const modalContent = `
        <h3>健康記録</h3>
        <div class="health-record-form">
            <h4>今日のバイタルデータを記録</h4>
            <form id="health-form">
                <div class="form-group">
                    <label for="blood-pressure">血圧 (mmHg)</label>
                    <div class="input-group">
                        <input type="number" id="systolic" placeholder="収縮期" min="80" max="200">
                        <span>/</span>
                        <input type="number" id="diastolic" placeholder="拡張期" min="50" max="120">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="heart-rate">心拍数 (bpm)</label>
                    <input type="number" id="heart-rate" placeholder="例: 72" min="40" max="200">
                </div>
                
                <div class="form-group">
                    <label for="weight">体重 (kg)</label>
                    <input type="number" id="weight" placeholder="例: 65.2" step="0.1" min="30" max="200">
                </div>
                
                <div class="form-group">
                    <label for="sleep-hours">睡眠時間 (時間)</label>
                    <input type="number" id="sleep-hours" placeholder="例: 7.5" step="0.5" min="0" max="24">
                </div>
                
                <div class="form-group">
                    <label for="exercise-minutes">運動時間 (分)</label>
                    <input type="number" id="exercise-minutes" placeholder="例: 30" min="0" max="600">
                </div>
                
                <div class="form-group">
                    <label for="water-intake">水分摂取量 (L)</label>
                    <input type="number" id="water-intake" placeholder="例: 2.0" step="0.1" min="0" max="10">
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-primary">記録を保存</button>
                    <button type="button" class="btn-secondary" onclick="closeModal()">キャンセル</button>
                </div>
            </form>
        </div>
    `;
    
    showModal(modalContent);
    
    // フォーム送信処理
    document.getElementById('health-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveHealthRecord();
    });
}

// AI診断機能
function openAIDiagnosis() {
    const modalContent = `
        <h3>AI健康診断</h3>
        <div class="ai-diagnosis-content">
            <div class="diagnosis-progress">
                <h4>データ分析中...</h4>
                <div class="progress-bar">
                    <div class="progress-fill" id="progress-fill"></div>
                </div>
                <p id="progress-text">健康データを解析しています</p>
            </div>
            
            <div class="diagnosis-results" id="diagnosis-results" style="display: none;">
                <h4>🤖 AI分析結果</h4>
                
                <div class="health-score">
                    <h5>総合健康スコア</h5>
                    <div class="score-circle">
                        <span class="score-value">85</span>
                        <span class="score-max">/100</span>
                    </div>
                    <p class="score-status">良好な健康状態です</p>
                </div>
                
                <div class="recommendations">
                    <h5>💡 改善提案</h5>
                    <ul>
                        <li class="recommendation-item">
                            <span class="rec-icon">💧</span>
                            <span>水分摂取量を1日200ml増やすことを推奨します</span>
                        </li>
                        <li class="recommendation-item">
                            <span class="rec-icon">🏃</span>
                            <span>週3回、30分の有酸素運動を継続しましょう</span>
                        </li>
                        <li class="recommendation-item">
                            <span class="rec-icon">😴</span>
                            <span>睡眠時間を7-8時間に調整することで更なる改善が期待できます</span>
                        </li>
                    </ul>
                </div>
                
                <div class="risk-alerts">
                    <h5>⚠️ 注意事項</h5>
                    <div class="alert-card">
                        <p>血圧の変動が見られます。継続的な記録と健康的な生活習慣を心がけましょう。</p>
                        <button class="btn-primary" onclick="openHealthRecord()">追加記録する</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(modalContent);
    startAIDiagnosis();
}


// モーダル表示機能
function showModal(content) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = content;
    modal.style.display = 'block';
    
    // アクセシビリティ: フォーカス管理
    const firstInput = modalBody.querySelector('input, button, select, textarea');
    if (firstInput) {
        firstInput.focus();
    }
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// 健康記録保存
function saveHealthRecord() {
    const formData = {
        systolic: document.getElementById('systolic').value,
        diastolic: document.getElementById('diastolic').value,
        heartRate: document.getElementById('heart-rate').value,
        weight: document.getElementById('weight').value,
        sleepHours: document.getElementById('sleep-hours').value,
        exerciseMinutes: document.getElementById('exercise-minutes').value,
        waterIntake: document.getElementById('water-intake').value,
        timestamp: new Date().toISOString()
    };
    
    // ローカルストレージに保存（実際のアプリではサーバーに送信）
    const existingData = JSON.parse(localStorage.getItem('healthRecords') || '[]');
    existingData.push(formData);
    localStorage.setItem('healthRecords', JSON.stringify(existingData));
    
    showSuccessMessage('健康記録が保存されました！');
    closeModal();
    updateDashboard();
}

// AI診断進行
function startAIDiagnosis() {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const results = document.getElementById('diagnosis-results');
    
    let progress = 0;
    const steps = [
        'バイタルデータを分析中...',
        '生活習慣パターンを解析中...',
        '健康リスクを評価中...',
        '改善提案を生成中...',
        '分析完了！'
    ];
    
    const interval = setInterval(() => {
        progress += 20;
        progressFill.style.width = progress + '%';
        
        if (progress <= 80) {
            progressText.textContent = steps[Math.floor(progress / 20)];
        } else {
            progressText.textContent = steps[4];
            clearInterval(interval);
            
            setTimeout(() => {
                document.querySelector('.diagnosis-progress').style.display = 'none';
                results.style.display = 'block';
            }, 1000);
        }
    }, 800);
}


// 成功メッセージ表示
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <span class="success-icon">✅</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// ダッシュボード更新
function updateDashboard() {
    // 最新の健康記録を取得してダッシュボードを更新
    const records = JSON.parse(localStorage.getItem('healthRecords') || '[]');
    if (records.length > 0) {
        const latest = records[records.length - 1];
        
        // バイタルデータの更新
        const vitalItems = document.querySelectorAll('.vital-item');
        if (latest.systolic && latest.diastolic) {
            vitalItems[0].querySelector('.vital-value').textContent = `${latest.systolic}/${latest.diastolic}`;
        }
        if (latest.heartRate) {
            vitalItems[1].querySelector('.vital-value').textContent = `${latest.heartRate} bpm`;
        }
        if (latest.weight) {
            vitalItems[2].querySelector('.vital-value').textContent = `${latest.weight} kg`;
        }
    }
}

// リアルタイムデータ更新シミュレーション
function updateHealthData() {
    setInterval(() => {
        // 時間の更新など
        const now = new Date();
        console.log(`Health Book: ${now.toLocaleTimeString()} - システム正常動作中`);
    }, 60000); // 1分ごと
}

// スクロールアニメーション
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    });
    
    document.querySelectorAll('.feature-card, .dashboard-card').forEach(card => {
        observer.observe(card);
    });
}

// インタラクション初期化
function initializeInteractions() {
    // モーダルの外側クリックで閉じる
    window.onclick = function(event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            closeModal();
        }
    };
    
    // ESCキーでモーダルを閉じる
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
    
}

// CSS アニメーション用のスタイルを動的に追加
const style = document.createElement('style');
style.textContent = `
    .success-message {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        animation: slideIn 0.3s ease;
    }
    
    .success-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .progress-bar {
        width: 100%;
        height: 8px;
        background: var(--medium-gray);
        border-radius: 4px;
        overflow: hidden;
        margin: 1rem 0;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary-green), var(--accent-orange));
        transition: width 0.3s ease;
        width: 0%;
    }
    
    .score-circle {
        display: inline-block;
        font-size: 2rem;
        font-weight: 700;
        color: var(--primary-green);
        margin: 1rem 0;
    }
    
    .score-max {
        font-size: 1rem;
        color: var(--medium-gray);
    }
    
    .recommendation-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        background: var(--light-gray);
        border-radius: 8px;
        margin-bottom: 0.5rem;
    }
    
    .rec-icon {
        font-size: 1.25rem;
    }
    
    .form-group {
        margin-bottom: 1.5rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: var(--primary-navy);
    }
    
    .form-group input, .form-group select, .form-group textarea {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid var(--medium-gray);
        border-radius: 6px;
        font-size: 16px;
        transition: border-color 0.3s ease;
    }
    
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
        outline: none;
        border-color: var(--primary-green);
    }
    
    .input-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .input-group input {
        flex: 1;
    }
    
    .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
    }
    
    .btn-secondary {
        background: var(--medium-gray);
        color: var(--dark-gray);
        border: none;
        padding: 1rem 2rem;
        font-size: 16px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .btn-secondary:hover {
        background: var(--dark-gray);
        color: var(--white);
    }
    
    .alert-card {
        padding: 1rem;
        background: var(--light-gray);
        border-radius: 8px;
        border-left: 3px solid var(--warning);
        margin-top: 0.5rem;
    }
    
    .alert-card p {
        margin-bottom: 1rem;
        color: var(--dark-gray);
    }
`;

document.head.appendChild(style);

console.log('Health Book Platform JavaScript loaded successfully');