// Health Book - インタラクション機能（新デザイン対応）

document.addEventListener('DOMContentLoaded', function() {
    // 全ての円形ボタンを取得
    const circularButtons = document.querySelectorAll('.circular-button');
    
    // 各ボタンにイベントリスナーを追加
    circularButtons.forEach(button => {
        const buttonTitle = button.querySelector('.button-title').textContent;
        const buttonType = button.classList.contains('ai-diagnosis') ? 'AI診断' : '健康記録';
        
        // クリック/タップイベント
        button.addEventListener('click', function() {
            handleButtonClick(buttonType);
        });
        
        // キーボードイベント（Enterキーとスペースキー）
        button.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleButtonClick(buttonType);
            }
        });
        
        // タッチイベント用の追加処理
        let touchStartTime;
        
        button.addEventListener('touchstart', function(event) {
            touchStartTime = Date.now();
            // タッチフィードバック開始
            button.style.transform = 'translateY(-1px) scale(0.98)';
        }, { passive: true });
        
        button.addEventListener('touchend', function(event) {
            const touchDuration = Date.now() - touchStartTime;
            
            // タッチフィードバック終了
            setTimeout(() => {
                button.style.transform = '';
            }, 100);
            
            // 短いタップのみ反応（長押し無効化）
            if (touchDuration < 500) {
                event.preventDefault();
                handleButtonClick(buttonType);
            }
        }, { passive: false });
        
        // タッチキャンセル時の処理
        button.addEventListener('touchcancel', function() {
            button.style.transform = '';
        });
        
        // マウスイベント用の追加処理
        button.addEventListener('mousedown', function() {
            button.style.transform = 'translateY(-1px) scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            setTimeout(() => {
                button.style.transform = '';
            }, 100);
        });
        
        button.addEventListener('mouseleave', function() {
            button.style.transform = '';
        });
    });
});

/**
 * ボタンクリック時の処理
 * @param {string} buttonType - ボタンタイプ（AI診断 or 健康記録）
 */
function handleButtonClick(buttonType) {
    // デバッグ用ログ
    console.log(`${buttonType}ボタンがクリックされました`);
    
    // ボタンにパルス効果を追加
    addPulseEffect(buttonType);
    
    // 実際の機能呼び出し
    switch(buttonType) {
        case 'AI診断':
            handleAIDiagnosis();
            break;
        case '健康記録':
            handleHealthRecord();
            break;
        default:
            console.log('未知のボタンタイプ:', buttonType);
    }
}

/**
 * パルス効果の追加
 * @param {string} buttonType - ボタンタイプ
 */
function addPulseEffect(buttonType) {
    const button = buttonType === 'AI診断' 
        ? document.querySelector('.ai-diagnosis')
        : document.querySelector('.health-record');
    
    if (!button) return;
    
    // パルス効果のCSS追加
    button.style.animation = 'pulse 0.6s ease-out';
    
    // アニメーション終了後にリセット
    setTimeout(() => {
        button.style.animation = '';
    }, 600);
}

/**
 * AI診断機能の処理
 */
function handleAIDiagnosis() {
    console.log('AI診断機能を実行中...');
    
    // AI診断モーダルを表示
    showAIDiagnosisModal();
}

/**
 * 健康記録機能の処理
 */
function handleHealthRecord() {
    console.log('健康記録機能を実行中...');
    
    // 健康記録入力モーダルを表示
    showHealthRecordModal();
}

/**
 * 一時的なフィードバック表示
 * @param {string} message - 表示するメッセージ
 * @param {string} backgroundColor - 背景色
 */
function showTemporaryFeedback(message, backgroundColor = '#4CAF50') {
    // 既存のフィードバックがあれば削除
    const existingFeedback = document.querySelector('.temporary-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // フィードバック要素を作成
    const feedback = document.createElement('div');
    feedback.className = 'temporary-feedback';
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background-color: ${backgroundColor};
        color: #000000;
        padding: 15px 25px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 600;
        z-index: 1000;
        opacity: 0;
        transition: all 0.3s ease;
        pointer-events: none;
        border: 2px solid #000000;
        font-family: 'Noto Sans JP', sans-serif;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        max-width: 300px;
        text-align: center;
    `;
    
    // DOMに追加
    document.body.appendChild(feedback);
    
    // フェードイン
    setTimeout(() => {
        feedback.style.opacity = '1';
        feedback.style.transform = 'translateX(-50%) translateY(-5px)';
    }, 10);
    
    // 3秒後にフェードアウトして削除
    setTimeout(() => {
        feedback.style.opacity = '0';
        feedback.style.transform = 'translateX(-50%) translateY(5px)';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 300);
    }, 3000);
}

// パルス効果のCSSアニメーション追加
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// パフォーマンス最適化：パッシブイベントリスナー
document.addEventListener('touchstart', function() {}, { passive: true });
document.addEventListener('touchmove', function() {}, { passive: true });

// 健康記録関連の機能

// グローバル変数
let currentRatingGroup = null;
let currentDate = new Date();

/**
 * 健康記録入力モーダルを表示
 */
function showHealthRecordModal() {
    const modal = document.getElementById('health-record-modal');
    modal.classList.remove('hidden');
    
    // フォームをリセット
    document.getElementById('health-record-form').reset();
    document.getElementById('throat-pain').value = '';
    document.getElementById('runny-nose').value = '';
    
    // 選択状態をクリア
    document.querySelectorAll('.rating-btn.selected').forEach(btn => {
        btn.classList.remove('selected');
    });
}

/**
 * カレンダーを表示
 */
function showCalendar() {
    renderCalendar();
}

/**
 * 健康記録データを取得
 */
function getHealthRecords() {
    const data = localStorage.getItem('healthRecords');
    return data ? JSON.parse(data) : [];
}

/**
 * 健康記録データを保存
 */
function saveHealthRecord(record) {
    const records = getHealthRecords();
    const dateKey = record.date;
    
    // 同じ日付の記録があれば更新、なければ追加
    const existingIndex = records.findIndex(r => r.date === dateKey);
    if (existingIndex >= 0) {
        records[existingIndex] = record;
    } else {
        records.push(record);
    }
    
    localStorage.setItem('healthRecords', JSON.stringify(records));
}

/**
 * カレンダーを描画
 */
function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const monthSpan = document.getElementById('current-month');
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 月表示を更新
    monthSpan.textContent = `${year}年${month + 1}月`;
    
    // カレンダーグリッドをクリア
    grid.innerHTML = '';
    
    // 曜日ヘッダーを追加
    const dayHeaders = ['日', '月', '火', '水', '木', '金', '土'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.textContent = day;
        dayHeader.style.fontWeight = '700';
        dayHeader.style.textAlign = 'center';
        dayHeader.style.padding = '10px 5px';
        dayHeader.style.backgroundColor = 'var(--bg-color)';
        dayHeader.style.border = '1px solid var(--button-border)';
        grid.appendChild(dayHeader);
    });
    
    // 月の最初と最後の日を取得
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // 健康記録データを取得
    const healthRecords = getHealthRecords();
    const today = new Date();
    
    // カレンダーの日付を生成（6週間分）
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        // 他の月の日付かチェック
        if (date.getMonth() !== month) {
            dayElement.classList.add('other-month');
        }
        
        // 今日かチェック
        if (date.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
        
        // 日付を表示
        const dayNumber = document.createElement('div');
        dayNumber.textContent = date.getDate();
        dayElement.appendChild(dayNumber);
        
        // 健康記録があるかチェック
        const dateKey = formatDate(date);
        const record = healthRecords.find(r => r.date === dateKey);
        
        if (record) {
            dayElement.classList.add('has-record');
            
            // 健康記録の詳細を表示
            const indicator = document.createElement('div');
            indicator.className = 'health-record-indicator';
            
            const tempDiv = document.createElement('div');
            tempDiv.className = 'temp';
            tempDiv.textContent = `${record.temperature}℃`;
            indicator.appendChild(tempDiv);
            
            const symptomsDiv = document.createElement('div');
            symptomsDiv.className = 'symptoms';
            symptomsDiv.textContent = `のど:${record.throatPain} 鼻:${record.runnyNose}`;
            indicator.appendChild(symptomsDiv);
            
            dayElement.appendChild(indicator);
        }
        
        // クリックイベントを追加（現在の月の日付のみ）
        if (date.getMonth() === month) {
            dayElement.addEventListener('click', () => {
                showHealthRecordModalForDate(date);
            });
        }
        
        grid.appendChild(dayElement);
    }
}

/**
 * 指定した日付の健康記録入力モーダルを表示
 */
function showHealthRecordModalForDate(date) {
    const dateKey = formatDate(date);
    const healthRecords = getHealthRecords();
    const existingRecord = healthRecords.find(r => r.date === dateKey);
    
    showHealthRecordModal();
    
    // 既存の記録があれば値を設定
    if (existingRecord) {
        document.getElementById('temperature').value = existingRecord.temperature;
        document.getElementById('throat-pain').value = existingRecord.throatPain;
        document.getElementById('runny-nose').value = existingRecord.runnyNose;
        
        // 評価ボタンの選択状態を復元
        document.querySelectorAll('.rating-btn').forEach(btn => {
            btn.classList.remove('selected');
            const group = btn.closest('.input-group');
            const hiddenInput = group.querySelector('input[type="hidden"]');
            if (hiddenInput.value === btn.dataset.rating) {
                btn.classList.add('selected');
            }
        });
    }
    
    // フォームに日付情報を保存
    document.getElementById('health-record-form').dataset.date = dateKey;
}

/**
 * 日付をフォーマット（YYYY-MM-DD）
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// イベントリスナーの設定
document.addEventListener('DOMContentLoaded', function() {
    // ページ読み込み時にカレンダーを表示
    renderCalendar();
    
    // 「新しく記録する」ボタンのイベント
    document.getElementById('add-record-btn').addEventListener('click', function() {
        showHealthRecordModal();
    });
    
    // 評価ボタンのイベント
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('rating-btn')) {
            const group = e.target.closest('.input-group');
            const hiddenInput = group.querySelector('input[type="hidden"]');
            const buttons = group.querySelectorAll('.rating-btn');
            
            // 同じグループ内の他のボタンの選択を解除
            buttons.forEach(btn => btn.classList.remove('selected'));
            
            // クリックされたボタンを選択状態にする
            e.target.classList.add('selected');
            hiddenInput.value = e.target.dataset.rating;
        }
    });
    
    // モーダルを閉じる
    document.getElementById('close-modal').addEventListener('click', function() {
        document.getElementById('health-record-modal').classList.add('hidden');
    });
    
    document.getElementById('cancel-form').addEventListener('click', function() {
        document.getElementById('health-record-modal').classList.add('hidden');
    });
    
    // フォーム送信
    document.getElementById('health-record-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const temperature = document.getElementById('temperature').value;
        const throatPain = document.getElementById('throat-pain').value;
        const runnyNose = document.getElementById('runny-nose').value;
        
        // バリデーション
        if (!temperature || !throatPain || !runnyNose) {
            alert('すべての項目を入力してください。');
            return;
        }
        
        if (parseFloat(temperature) < 35 || parseFloat(temperature) > 42) {
            alert('体温は35℃から42℃の間で入力してください。');
            return;
        }
        
        // 日付を取得（フォームに保存されている場合はそれを使用、なければ今日）
        const dateKey = this.dataset.date || formatDate(new Date());
        
        // 健康記録を保存
        const record = {
            date: dateKey,
            temperature: parseFloat(temperature),
            throatPain: parseInt(throatPain),
            runnyNose: parseInt(runnyNose),
            timestamp: new Date().toISOString()
        };
        
        saveHealthRecord(record);
        
        // モーダルを閉じる
        document.getElementById('health-record-modal').classList.add('hidden');
        
        // 成功メッセージを表示
        showTemporaryFeedback('✅ 健康記録を保存しました', '#CCFFCC');
        
        // カレンダーを更新
        renderCalendar();
    });
    
    // カレンダーナビゲーション
    document.getElementById('prev-month').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    document.getElementById('next-month').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    // マイページアイコンのクリックイベント
    document.getElementById('user-icon').addEventListener('click', function() {
        showMyPage();
    });
    
    // マイページを閉じる
    document.getElementById('close-mypage').addEventListener('click', function() {
        document.getElementById('mypage-modal').classList.add('hidden');
    });
    
    // プロフィール編集
    document.getElementById('edit-profile-btn').addEventListener('click', function() {
        showProfileEditModal();
    });
    
    document.getElementById('close-profile-edit').addEventListener('click', function() {
        document.getElementById('profile-edit-modal').classList.add('hidden');
    });
    
    document.getElementById('cancel-profile-edit').addEventListener('click', function() {
        document.getElementById('profile-edit-modal').classList.add('hidden');
    });
    
    // プロフィール編集フォーム送信
    document.getElementById('profile-edit-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProfile();
    });
    
    // データエクスポート
    document.getElementById('export-data-btn').addEventListener('click', function() {
        exportHealthData();
    });
    
    // データ削除
    document.getElementById('clear-data-btn').addEventListener('click', function() {
        clearAllData();
    });
    
    // モーダル背景クリックで閉じる
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.add('hidden');
        }
    });
    
    // プロフィール情報を読み込み
    loadProfile();
});

// マイページ関連の機能

/**
 * マイページを表示
 */
function showMyPage() {
    const modal = document.getElementById('mypage-modal');
    modal.classList.remove('hidden');
    updateHealthStats();
}

/**
 * プロフィール編集モーダルを表示
 */
function showProfileEditModal() {
    const profile = getProfile();
    document.getElementById('edit-name').value = profile.name;
    document.getElementById('edit-email').value = profile.email;
    
    document.getElementById('profile-edit-modal').classList.remove('hidden');
}

/**
 * プロフィール情報を取得
 */
function getProfile() {
    const data = localStorage.getItem('userProfile');
    return data ? JSON.parse(data) : {
        name: 'ユーザー',
        email: 'user@example.com'
    };
}

/**
 * プロフィール情報を保存
 */
function saveProfile() {
    const name = document.getElementById('edit-name').value;
    const email = document.getElementById('edit-email').value;
    
    if (!name || !email) {
        alert('すべての項目を入力してください。');
        return;
    }
    
    const profile = { name, email };
    localStorage.setItem('userProfile', JSON.stringify(profile));
    
    // 表示を更新
    loadProfile();
    
    // モーダルを閉じる
    document.getElementById('profile-edit-modal').classList.add('hidden');
    
    showTemporaryFeedback('✅ プロフィールを更新しました', '#CCFFCC');
}

/**
 * プロフィール情報を読み込み
 */
function loadProfile() {
    const profile = getProfile();
    document.getElementById('profile-name').textContent = profile.name;
    document.getElementById('profile-email').textContent = profile.email;
}

/**
 * 健康記録統計を更新
 */
function updateHealthStats() {
    const records = getHealthRecords();
    
    // 記録日数
    document.getElementById('total-records').textContent = records.length;
    
    // 平均体温
    if (records.length > 0) {
        const avgTemp = records.reduce((sum, record) => sum + record.temperature, 0) / records.length;
        document.getElementById('avg-temperature').textContent = avgTemp.toFixed(1) + '℃';
    } else {
        document.getElementById('avg-temperature').textContent = '--';
    }
    
    // 連続記録日数
    const streak = calculateStreak(records);
    document.getElementById('recent-streak').textContent = streak + '日';
}

/**
 * 連続記録日数を計算
 */
function calculateStreak(records) {
    if (records.length === 0) return 0;
    
    // 日付順にソート
    const sortedRecords = records.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let streak = 0;
    const today = new Date();
    let currentDate = new Date(today);
    
    for (let i = 0; i < sortedRecords.length; i++) {
        const recordDate = new Date(sortedRecords[i].date);
        const expectedDate = new Date(currentDate);
        
        if (recordDate.toDateString() === expectedDate.toDateString()) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    return streak;
}

/**
 * 健康データをエクスポート
 */
function exportHealthData() {
    const records = getHealthRecords();
    const profile = getProfile();
    
    const exportData = {
        profile: profile,
        healthRecords: records,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `健康記録_${formatDate(new Date())}.json`;
    link.click();
    
    showTemporaryFeedback('✅ データをエクスポートしました', '#CCFFCC');
}

/**
 * すべてのデータを削除
 */
function clearAllData() {
    if (confirm('すべての健康記録データを削除しますか？この操作は取り消せません。')) {
        localStorage.removeItem('healthRecords');
        localStorage.removeItem('userProfile');
        
        // 表示を更新
        loadProfile();
        updateHealthStats();
        renderCalendar();
        
        showTemporaryFeedback('🗑️ すべてのデータを削除しました', '#ffcccc');
    }
}

// AI診断機能
let aiDiagnosisState = {
    currentQuestion: 0,
    answers: {},
    questions: [
        {
            id: 'fever',
            text: '発熱していますか？',
            type: 'yesno',
            options: ['はい', 'いいえ']
        },
        {
            id: 'medication',
            text: '現在薬を服用していますか？',
            type: 'yesno',
            options: ['はい', 'いいえ']
        },
        {
            id: 'homeRemedies',
            text: '家の中に常備薬はありますか？',
            type: 'scale',
            options: ['1', '2', '3', '4', '5'],
            scaleLabels: ['全くない', '少しある', 'ある程度ある', 'かなりある', 'たくさんある']
        },
        {
            id: 'mobility',
            text: '病院まで歩けそうですか？',
            type: 'yesno',
            options: ['はい', 'いいえ']
        },
        {
            id: 'support',
            text: '現在頼れる人はいますか？',
            type: 'yesno',
            options: ['はい', 'いいえ']
        }
    ]
};

/**
 * AI診断モーダルを表示
 */
function showAIDiagnosisModal() {
    const modal = document.getElementById('ai-diagnosis-modal');
    modal.classList.remove('hidden');
    
    // 診断状態をリセット
    resetAIDiagnosis();
    
    // 最初の質問を表示
    showCurrentQuestion();
}

/**
 * AI診断状態をリセット
 */
function resetAIDiagnosis() {
    aiDiagnosisState.currentQuestion = 0;
    aiDiagnosisState.answers = {};
    
    // 質問セクションを表示、結果セクションを非表示
    document.getElementById('ai-diagnosis-questions').classList.remove('hidden');
    document.getElementById('ai-diagnosis-result').classList.add('hidden');
}

/**
 * 現在の質問を表示
 */
function showCurrentQuestion() {
    const questionData = aiDiagnosisState.questions[aiDiagnosisState.currentQuestion];
    const currentQuestionNum = aiDiagnosisState.currentQuestion + 1;
    const totalQuestions = aiDiagnosisState.questions.length;
    
    // プログレスバーを更新
    const progressFill = document.getElementById('progress-fill');
    const progressPercent = (currentQuestionNum / totalQuestions) * 100;
    progressFill.style.width = `${progressPercent}%`;
    
    // 質問番号を更新
    document.getElementById('current-question').textContent = currentQuestionNum;
    
    // 質問文を更新
    document.getElementById('question-text').textContent = questionData.text;
    
    // 回答オプションを生成
    const answerOptionsContainer = document.getElementById('answer-options');
    answerOptionsContainer.innerHTML = '';
    
    if (questionData.type === 'yesno') {
        answerOptionsContainer.className = 'answer-options';
        questionData.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'answer-option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => selectAnswer(index));
            answerOptionsContainer.appendChild(optionElement);
        });
    } else if (questionData.type === 'scale') {
        answerOptionsContainer.className = 'answer-options';
        
        const scaleContainer = document.createElement('div');
        scaleContainer.className = 'scale-options';
        
        questionData.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'scale-option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => selectAnswer(index));
            scaleContainer.appendChild(optionElement);
        });
        
        answerOptionsContainer.appendChild(scaleContainer);
        
        // スケールラベルを追加
        const labelsContainer = document.createElement('div');
        labelsContainer.className = 'scale-labels';
        labelsContainer.innerHTML = `
            <span>${questionData.scaleLabels[0]}</span>
            <span>${questionData.scaleLabels[4]}</span>
        `;
        answerOptionsContainer.appendChild(labelsContainer);
    }
    
    // ナビゲーションボタンの状態を更新
    updateNavigationButtons();
}

/**
 * 回答を選択
 */
function selectAnswer(answerIndex) {
    const questionData = aiDiagnosisState.questions[aiDiagnosisState.currentQuestion];
    
    // 既存の選択状態をクリア
    document.querySelectorAll('.answer-option, .scale-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // 新しい選択状態を設定
    const selectedOption = document.querySelectorAll('.answer-option, .scale-option')[answerIndex];
    selectedOption.classList.add('selected');
    
    // 回答を保存
    aiDiagnosisState.answers[questionData.id] = {
        index: answerIndex,
        value: questionData.options[answerIndex],
        text: questionData.type === 'yesno' ? questionData.options[answerIndex] :
              questionData.type === 'scale' ? questionData.scaleLabels[answerIndex] : questionData.options[answerIndex]
    };
    
    // ナビゲーションボタンの状態を更新
    updateNavigationButtons();
}

/**
 * ナビゲーションボタンの状態を更新
 */
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-question');
    const nextBtn = document.getElementById('next-question');
    const startBtn = document.getElementById('start-diagnosis');
    
    const isFirstQuestion = aiDiagnosisState.currentQuestion === 0;
    const isLastQuestion = aiDiagnosisState.currentQuestion === aiDiagnosisState.questions.length - 1;
    const hasAnswer = aiDiagnosisState.questions[aiDiagnosisState.currentQuestion].id in aiDiagnosisState.answers;
    
    // 前の質問ボタン
    prevBtn.style.display = isFirstQuestion ? 'none' : 'block';
    
    // 次の質問ボタンと診断開始ボタン
    if (isLastQuestion) {
        nextBtn.style.display = 'none';
        startBtn.style.display = hasAnswer ? 'block' : 'none';
    } else {
        nextBtn.style.display = hasAnswer ? 'block' : 'none';
        startBtn.style.display = 'none';
    }
    
    // ボタンの有効/無効状態
    nextBtn.disabled = !hasAnswer;
    startBtn.disabled = !hasAnswer;
}

/**
 * 前の質問に戻る
 */
function goToPreviousQuestion() {
    if (aiDiagnosisState.currentQuestion > 0) {
        aiDiagnosisState.currentQuestion--;
        showCurrentQuestion();
        
        // 既存の回答を復元
        const questionData = aiDiagnosisState.questions[aiDiagnosisState.currentQuestion];
        const existingAnswer = aiDiagnosisState.answers[questionData.id];
        if (existingAnswer) {
            setTimeout(() => {
                const options = document.querySelectorAll('.answer-option, .scale-option');
                if (options[existingAnswer.index]) {
                    options[existingAnswer.index].classList.add('selected');
                }
            }, 100);
        }
    }
}

/**
 * 次の質問に進む
 */
function goToNextQuestion() {
    if (aiDiagnosisState.currentQuestion < aiDiagnosisState.questions.length - 1) {
        aiDiagnosisState.currentQuestion++;
        showCurrentQuestion();
        
        // 既存の回答を復元
        const questionData = aiDiagnosisState.questions[aiDiagnosisState.currentQuestion];
        const existingAnswer = aiDiagnosisState.answers[questionData.id];
        if (existingAnswer) {
            setTimeout(() => {
                const options = document.querySelectorAll('.answer-option, .scale-option');
                if (options[existingAnswer.index]) {
                    options[existingAnswer.index].classList.add('selected');
                }
            }, 100);
        }
    }
}

/**
 * 最近の健康記録を取得
 */
function getRecentHealthRecords(healthRecords, days) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return healthRecords.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= cutoffDate;
    });
}

/**
 * AI診断を実行
 */
function performAIDiagnosis() {
    // 健康記録データを取得
    const healthRecords = getHealthRecords();
    
    // 診断ロジックを実行
    const diagnosis = generateDiagnosis(aiDiagnosisState.answers, healthRecords);
    
    // 結果を表示
    showDiagnosisResult(diagnosis);
}

/**
 * 診断ロジック
 */
function generateDiagnosis(answers, healthRecords) {
    const recommendations = [];
    let urgencyLevel = 'low'; // low, medium, high
    
    // 最近の健康記録を分析（過去7日間）
    const recentRecords = getRecentHealthRecords(healthRecords, 7);
    const hasRecentFever = recentRecords.some(record => record.temperature >= 37.5);
    const hasRecentSymptoms = recentRecords.some(record => record.throatPain >= 3 || record.runnyNose >= 3);
    
    // 回答の解析
    const hasFever = answers.fever?.value === 'はい';
    const isOnMedication = answers.medication?.value === 'はい';
    const homeRemediesLevel = parseInt(answers.homeRemedies?.value || '1');
    const canWalkToHospital = answers.mobility?.value === 'はい';
    const hasSupport = answers.support?.value === 'はい';
    
    // 緊急度判定
    if (hasFever && hasRecentFever) {
        urgencyLevel = 'high';
        recommendations.push({
            title: '🚨 緊急受診を推奨',
            content: '発熱が続いており、早急な医療機関での診察が必要です。',
            actions: [
                '今すぐ内科または救急外来を受診してください',
                '水分補給を十分に行ってください',
                '症状が悪化した場合は救急車を呼んでください'
            ]
        });
    } else if (hasFever || hasRecentSymptoms) {
        urgencyLevel = 'medium';
        
        if (canWalkToHospital) {
            recommendations.push({
                title: '🏥 医療機関受診を推奨',
                content: '症状が見られるため、医療機関での診察をお勧めします。',
                actions: [
                    '内科クリニックまたは病院を受診してください',
                    '受診前に医療機関に電話で症状を伝えてください',
                    '薬局で解熱剤や症状緩和薬の購入を検討してください'
                ]
            });
        } else {
            recommendations.push({
                title: '🏠 自宅療養と薬局利用',
                content: '移動が困難な場合の対処法をお勧めします。',
                actions: [
                    '近くの薬局で症状に応じた市販薬を購入してください',
                    hasSupport ? '信頼できる人に薬の購入を依頼してください' : '配達サービスのある薬局を利用してください',
                    '症状が悪化した場合は往診医や救急要請を検討してください'
                ]
            });
        }
    }
    
    // 既に服薬中の場合の注意
    if (isOnMedication) {
        recommendations.push({
            title: '💊 服薬中の注意事項',
            content: '現在服用中の薬がある場合の注意点です。',
            actions: [
                '新しい薬を服用する前に薬剤師または医師に相談してください',
                '飲み合わせによる副作用の可能性があります',
                '現在の薬のリストを医療機関で伝えてください'
            ]
        });
    }
    
    // 常備薬のレベルに応じた推奨
    if (homeRemediesLevel >= 3) {
        recommendations.push({
            title: '🏠 常備薬の活用',
            content: '自宅にある常備薬を有効活用しましょう。',
            actions: [
                '解熱剤（アセトアミノフェンなど）を用法用量を守って服用',
                '喉の痛みには喉スプレーやトローチを使用',
                '十分な休息と水分補給を心がけてください'
            ]
        });
    } else {
        recommendations.push({
            title: '🛒 薬局での購入推奨',
            content: '常備薬が不足している場合の対処法です。',
            actions: [
                '解熱剤（アセトアミノフェン、イブプロフェンなど）',
                '風邪薬や喉の痛み緩和薬',
                '経口補水液やビタミン剤も検討してください'
            ]
        });
    }
    
    // サポートがない場合の追加推奨
    if (!hasSupport) {
        recommendations.push({
            title: '🤝 サポート体制の構築',
            content: '一人での療養時の注意点とサポート体制の構築方法です。',
            actions: [
                '近隣の薬局の配達サービスを確認してください',
                '緊急時の連絡先（かかりつけ医、救急相談窓口）を準備',
                '症状日記をつけて変化を記録してください'
            ]
        });
    }
    
    // 症状がない場合の予防推奨
    if (!hasFever && !hasRecentSymptoms) {
        urgencyLevel = 'low';
        recommendations.push({
            title: '✅ 予防と健康維持',
            content: '現在症状は見られませんが、予防策を継続しましょう。',
            actions: [
                '規則正しい生活と十分な睡眠を心がけてください',
                '手洗い・うがいを徹底してください',
                '栄養バランスの良い食事を摂取してください',
                '定期的な健康記録の継続をお勧めします'
            ]
        });
    }
    
    return {
        urgencyLevel,
        recommendations,
        healthSummary: {
            recentRecords: recentRecords.length,
            averageTemperature: recentRecords.length > 0 ?
                (recentRecords.reduce((sum, r) => sum + r.temperature, 0) / recentRecords.length).toFixed(1) : '--',
            hasRecentFever,
            hasRecentSymptoms
        }
    };
}

/**
 * 診断結果を表示
 */
function showDiagnosisResult(diagnosis) {
    // 質問セクションを非表示、結果セクションを表示
    document.getElementById('ai-diagnosis-questions').classList.add('hidden');
    document.getElementById('ai-diagnosis-result').classList.remove('hidden');
    
    const diagnosisContent = document.getElementById('diagnosis-content');
    diagnosisContent.innerHTML = '';
    
    // 健康記録サマリーを表示
    if (diagnosis.healthSummary.recentRecords > 0) {
        const summaryCard = document.createElement('div');
        summaryCard.className = 'diagnosis-card';
        summaryCard.innerHTML = `
            <h4>📊 最近の健康記録（過去7日間）</h4>
            <p><strong>記録数:</strong> ${diagnosis.healthSummary.recentRecords}日分</p>
            <p><strong>平均体温:</strong> ${diagnosis.healthSummary.averageTemperature}℃</p>
            <p><strong>発熱の記録:</strong> ${diagnosis.healthSummary.hasRecentFever ? 'あり' : 'なし'}</p>
            <p><strong>症状の記録:</strong> ${diagnosis.healthSummary.hasRecentSymptoms ? 'あり' : 'なし'}</p>
        `;
        diagnosisContent.appendChild(summaryCard);
    }
    
    // 推奨事項を表示
    diagnosis.recommendations.forEach(recommendation => {
        const card = document.createElement('div');
        card.className = `diagnosis-card urgency-${diagnosis.urgencyLevel}`;
        
        const actionsHtml = recommendation.actions.map(action => `<li>${action}</li>`).join('');
        
        card.innerHTML = `
            <h4>${recommendation.title}</h4>
            <p>${recommendation.content}</p>
            <ul>${actionsHtml}</ul>
        `;
        
        diagnosisContent.appendChild(card);
    });
    
    // 免責事項を追加
    const disclaimerCard = document.createElement('div');
    disclaimerCard.className = 'diagnosis-card';
    disclaimerCard.innerHTML = `
        <h4>⚠️ 免責事項</h4>
        <p>この診断は参考情報であり、医師による診断に代わるものではありません。</p>
        <p>症状が重篤な場合や心配な場合は、必ず医療機関を受診してください。</p>
    `;
    diagnosisContent.appendChild(disclaimerCard);
}

// AI診断関連のイベントリスナーを追加
document.addEventListener('DOMContentLoaded', function() {
    // AI診断モーダルのイベントリスナー
    const aiDiagnosisModal = document.getElementById('ai-diagnosis-modal');
    if (aiDiagnosisModal) {
        // モーダルを閉じる
        document.getElementById('close-ai-diagnosis').addEventListener('click', function() {
            aiDiagnosisModal.classList.add('hidden');
        });
        
        // ナビゲーションボタン
        document.getElementById('prev-question').addEventListener('click', goToPreviousQuestion);
        document.getElementById('next-question').addEventListener('click', goToNextQuestion);
        document.getElementById('start-diagnosis').addEventListener('click', performAIDiagnosis);
        
        // 結果画面のボタン
        document.getElementById('restart-diagnosis').addEventListener('click', function() {
            resetAIDiagnosis();
            showCurrentQuestion();
        });
        
        document.getElementById('close-diagnosis').addEventListener('click', function() {
            aiDiagnosisModal.classList.add('hidden');
        });
    }
});