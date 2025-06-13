/**
 * ===================================================================
 * Health Book - 健康記録アプリのメインJavaScriptファイル
 * ===================================================================
 *
 * このファイルの主な機能：
 * 1. カレンダー表示と日付管理
 * 2. 健康記録の入力・保存・表示
 * 3. AI診断機能
 * 4. ユーザープロフィール管理
 * 5. データのエクスポート・削除
 *
 * 初心者向け解説：
 * - このプログラムは健康状態を記録・管理するWebアプリです
 * - ユーザーは体温や症状を入力し、カレンダーで履歴を確認できます
 * - データはブラウザのlocalStorageに保存されます
 * - AI診断機能で簡単な健康アドバイスも提供します
 *
 * ファイル構成：
 * - HTML: index.html（画面の構造）
 * - CSS: styles.css（画面のデザイン）
 * - JavaScript: このファイル（動作・機能）
 *
 * ===================================================================
 */

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
 * 健康記録データを取得する関数
 * - ブラウザのlocalStorageから保存済みの記録を読み込む
 * - データがない場合は空の配列を返す
 *
 * @returns {Array} - 健康記録の配列
 */
function getHealthRecords() {
    // localStorageから'healthRecords'というキーでデータを取得
    const data = localStorage.getItem('healthRecords');
    
    // データがあればJSON形式から配列に変換、なければ空の配列を返す
    return data ? JSON.parse(data) : [];
}

/**
 * 健康記録データを保存する関数
 * - 新しい記録を追加、または既存の記録を更新
 * - 同じ日付の記録がある場合は上書き
 *
 * @param {Object} record - 保存する健康記録オブジェクト
 */
function saveHealthRecord(record) {
    // 既存の記録をすべて取得
    const records = getHealthRecords();
    const dateKey = record.date; // 記録の日付（例："2025-06-12"）
    
    // 同じ日付の記録が既に存在するかチェック
    const existingIndex = records.findIndex(r => r.date === dateKey);
    
    if (existingIndex >= 0) {
        // 既存の記録がある場合：その記録を新しいデータで置き換え
        records[existingIndex] = record;
    } else {
        // 既存の記録がない場合：新しい記録として配列に追加
        records.push(record);
    }
    
    // 更新された記録配列をlocalStorageに保存
    // JSON形式の文字列に変換して保存
    localStorage.setItem('healthRecords', JSON.stringify(records));
}

/**
 * カレンダーを描画する関数
 * - 現在の月のカレンダーを表示
 * - 健康記録がある日付には記録内容を表示
 * - 日付をクリックすると健康記録入力モーダルが開く
 */
function renderCalendar() {
    // HTMLから必要な要素を取得
    const grid = document.getElementById('calendar-grid'); // カレンダーの枠組み
    const monthSpan = document.getElementById('current-month'); // 月表示部分
    
    // 現在表示中の年と月を取得
    const year = currentDate.getFullYear(); // 例：2025
    const month = currentDate.getMonth(); // 例：0（1月）、5（6月）※0から始まる
    
    // 画面上部に「◯年◯月」を表示（月は1から始まるように+1）
    monthSpan.textContent = `${year}年${month + 1}月`;
    
    // カレンダーの中身を一旦空にして、新しく作り直す
    grid.innerHTML = '';
    
    // カレンダーの上部に曜日を表示（日曜日から土曜日まで）
    const dayHeaders = ['日', '月', '火', '水', '木', '金', '土'];
    dayHeaders.forEach(day => {
        // 各曜日のセル（枠）を作成
        const dayHeader = document.createElement('div');
        dayHeader.textContent = day; // 曜日名を設定
        // 曜日セルのスタイルを設定
        dayHeader.style.fontWeight = '700'; // 太字
        dayHeader.style.textAlign = 'center'; // 中央揃え
        dayHeader.style.padding = '10px 5px'; // 内側の余白
        dayHeader.style.backgroundColor = 'var(--bg-color)'; // 背景色
        dayHeader.style.border = '1px solid var(--button-border)'; // 枠線
        grid.appendChild(dayHeader); // カレンダーに追加
    });
    
    // カレンダーの日付計算の準備
    const firstDay = new Date(year, month, 1); // 今月の1日
    const lastDay = new Date(year, month + 1, 0); // 今月の最終日
    const startDate = new Date(firstDay); // カレンダーの開始日（前月末を含む）
    // カレンダーは日曜日から始まるので、1日より前の日曜日を探す
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // 保存されている健康記録データを取得
    const healthRecords = getHealthRecords();
    const today = new Date(); // 今日の日付
    
    // カレンダーの日付セルを生成（6週間分＝42日分）
    // ※カレンダーは通常6週間で表示されます（前月末〜翌月初を含む）
    const createdDates = new Set(); // 重複した日付を防ぐためのリスト
    
    // 42回繰り返して、42個の日付セルを作成
    for (let i = 0; i < 42; i++) {
        // 開始日から i 日後の日付を計算
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        // 【重要】同じ日付が2回表示されることを防ぐチェック
        const dateString = date.toDateString(); // 日付を文字列に変換
        if (createdDates.has(dateString)) {
            continue; // 既に作成済みの日付ならスキップ
        }
        createdDates.add(dateString); // 作成した日付をリストに記録
        
        // 日付セル（1つ1つのマス）を作成
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day'; // CSSクラスを設定
        
        // 現在表示中の月以外の日付（前月末・翌月初）の場合
        if (date.getMonth() !== month) {
            dayElement.classList.add('other-month'); // 薄く表示するためのクラス
        }
        
        // 今日の日付の場合、特別な見た目にする
        if (date.toDateString() === today.toDateString()) {
            dayElement.classList.add('today'); // 今日を示すクラス
        }
        
        // 日付の数字部分を作成（例：1, 2, 3...31）
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number'; // CSSクラスを設定
        dayNumber.textContent = date.getDate(); // 日付の数字を設定
        dayElement.appendChild(dayNumber); // 日付セルに数字を追加
        
        // この日付に健康記録があるかチェック
        const dateKey = formatDate(date); // 日付を「YYYY-MM-DD」形式に変換
        const record = healthRecords.find(r => r.date === dateKey); // 該当する記録を探す
        
        // 健康記録が見つかった場合
        if (record) {
            dayElement.classList.add('has-record'); // 記録ありを示すクラス
            
            // 健康記録の内容を表示する小さなエリアを作成
            const indicator = document.createElement('div');
            indicator.className = 'health-record-indicator';
            
            // 体温を表示
            const tempDiv = document.createElement('div');
            tempDiv.className = 'temp';
            tempDiv.textContent = `${record.temperature}℃`;
            indicator.appendChild(tempDiv);
            
            // 症状（のどの痛み・鼻水）を表示
            const symptomsDiv = document.createElement('div');
            symptomsDiv.className = 'symptoms';
            symptomsDiv.textContent = `のど:${record.throatPain} 鼻:${record.runnyNose}`;
            indicator.appendChild(symptomsDiv);
            
            // 健康記録表示エリアを日付セルに追加
            dayElement.appendChild(indicator);
        }
        
        // 現在の月の日付のみクリック可能にする
        if (date.getMonth() === month) {
            // 日付をクリックすると健康記録入力画面が開く
            dayElement.addEventListener('click', () => {
                showHealthRecordModalForDate(date); // その日付の記録入力画面を表示
            });
            dayElement.style.cursor = 'pointer'; // マウスカーソルを指の形にする
        }
        
        // 完成した日付セルをカレンダーに追加
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
 * 日付をフォーマットする関数（YYYY-MM-DD形式に変換）
 * 例：2025年6月12日 → "2025-06-12"
 *
 * @param {Date} date - 変換したい日付オブジェクト
 * @returns {string} - "YYYY-MM-DD"形式の文字列
 */
function formatDate(date) {
    // 年を取得（例：2025）
    const year = date.getFullYear();
    
    // 月を取得（0から始まるので+1）し、2桁になるよう0埋め
    // 例：6月 → getMonth()=5 → 5+1=6 → "06"
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // 日を取得し、2桁になるよう0埋め
    // 例：12日 → "12"、5日 → "05"
    const day = String(date.getDate()).padStart(2, '0');
    
    // 「年-月-日」の形式で文字列を作成して返す
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
 * 質問回答の組み合わせに基づく個別化診断ロジック
 * - 各質問の回答を組み合わせて、具体的で個別化された診断文章を生成
 * - 回答パターンごとに異なる文章構成とアドバイスを提供
 */
function generateDiagnosis(answers, healthRecords) {
    const recommendations = [];
    let urgencyLevel = 'low';
    
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
    
    // 回答パターンに基づく状況分析コメント
    const situationAnalysis = generateSituationAnalysis(answers, recentRecords, hasRecentFever, hasRecentSymptoms);
    
    // 【パターン1】緊急度：高 - 発熱継続パターン
    if (hasFever && hasRecentFever) {
        urgencyLevel = 'high';
        
        if (isOnMedication && !canWalkToHospital && !hasSupport) {
            // 最も困難な状況
            recommendations.push({
                title: '🚨 緊急対応が必要な状況',
                content: `${situationAnalysis.critical}現在服薬中で移動も困難、そして頼れる人もいない状況は非常に心配です。一人で無理をせず、以下の緊急対応を検討してください。`,
                actions: [
                    '救急相談ダイヤル（#7119）にすぐに電話して相談',
                    '往診可能な医療機関を探して連絡',
                    '必要に応じて救急車の要請も躊躇しない',
                    '近隣住民や管理人への緊急時連絡も検討'
                ]
            });
        } else if (isOnMedication) {
            // 服薬中の発熱継続
            recommendations.push({
                title: '🚨 服薬中の発熱継続 - 即座の医療対応必要',
                content: `${situationAnalysis.critical}現在服用中の薬との相互作用や、薬の効果に影響する可能性があります。薬の情報を持参して緊急受診してください。`,
                actions: [
                    '服用中の薬をすべて持参して内科受診',
                    '薬手帳または服薬リストを準備',
                    canWalkToHospital ? '徒歩可能でも付き添いを依頼' : '救急車または往診を検討',
                    '水分補給は少量ずつ頻回に'
                ]
            });
        } else {
            // 基本的な発熱継続パターン
            recommendations.push({
                title: '🚨 発熱継続による緊急受診推奨',
                content: `${situationAnalysis.critical}${canWalkToHospital ? '歩行可能とのことですが' : '移動困難な状況で'}、迅速な医療対応が必要です。`,
                actions: canWalkToHospital ? [
                    '最寄りの内科クリニックまたは病院を即座に受診',
                    '事前に電話で症状と来院予定時刻を伝達',
                    '十分な水分と軽食を摂取してから外出',
                    '症状悪化時の緊急連絡先を確認'
                ] : [
                    '往診可能な医療機関に連絡',
                    '救急外来への搬送も視野に入れる',
                    hasSupport ? '信頼できる人に付き添いを依頼' : '近隣への緊急時サポート要請',
                    '解熱剤の適切な使用について電話相談'
                ]
            });
        }
    }
    
    // 【パターン2】緊急度：中 - 症状ありパターン
    else if (hasFever || hasRecentSymptoms) {
        urgencyLevel = 'medium';
        
        if (!canWalkToHospital && !hasSupport && homeRemediesLevel <= 2) {
            // 支援なし・薬なし・移動困難
            recommendations.push({
                title: '🏠 孤立状況での症状管理戦略',
                content: `${situationAnalysis.moderate}移動困難で常備薬も少なく、頼れる人もいない状況は心配です。段階的なサポート体制の構築と症状管理を組み合わせましょう。`,
                actions: [
                    '薬局の配達サービスまたはオンライン注文を利用',
                    '地域の医療相談窓口（保健所等）に電話相談',
                    '症状日記をつけて変化を詳細に記録',
                    '緊急時は躊躇せず救急要請'
                ]
            });
        } else if (homeRemediesLevel >= 4 && hasSupport) {
            // 充実した環境での症状管理
            recommendations.push({
                title: '🏠 充実した環境での症状管理',
                content: `${situationAnalysis.moderate}幸い常備薬も豊富で頼れる人もいるという恵まれた環境です。この状況を活かして効果的な症状管理を行いましょう。`,
                actions: [
                    '常備薬を症状に応じて適切に使用',
                    '頼れる人に症状経過の観察をお願い',
                    canWalkToHospital ? '症状悪化時の受診計画を事前に相談' : '往診医の連絡先を確認',
                    '栄養価の高い食事の準備をサポートしてもらう'
                ]
            });
        } else if (isOnMedication) {
            // 服薬中の症状出現
            recommendations.push({
                title: '💊 服薬中の新症状 - 慎重な対応必要',
                content: `${situationAnalysis.moderate}現在の服薬が症状に影響している可能性もあります。自己判断での薬の追加は避け、医療専門家への相談を優先してください。`,
                actions: [
                    '服用中の薬と症状の関連を薬剤師に相談',
                    '医師に現在の症状と服薬状況を詳しく報告',
                    '新たな薬の追加は医療専門家の指示を待つ',
                    '症状と服薬時間の記録を詳細につける'
                ]
            });
        } else {
            // 一般的な症状管理
            recommendations.push({
                title: '🏥 適切な症状管理と医療相談',
                content: `${situationAnalysis.moderate}現在の症状レベルでは、適切な初期対応と医療機関での相談が効果的です。`,
                actions: canWalkToHospital ? [
                    '内科クリニックでの診察を予約',
                    '症状の詳細記録を持参',
                    '市販薬の使用前に薬剤師に相談'
                ] : [
                    '電話での医療相談を活用',
                    hasSupport ? 'サポート可能な人に薬局での購入依頼' : '配達サービス利用',
                    '症状変化の詳細な観察と記録'
                ]
            });
        }
    }
    
    // 【パターン3】緊急度：低 - 予防・維持パターン
    else {
        urgencyLevel = 'low';
        
        if (homeRemediesLevel >= 4 && hasSupport) {
            // 最適な予防環境
            recommendations.push({
                title: '✅ 理想的な健康維持環境',
                content: `${situationAnalysis.positive}素晴らしい環境が整っています。この恵まれた状況を活かして、より積極的な健康管理に取り組みましょう。`,
                actions: [
                    '定期的な健康チェックと記録の継続',
                    '常備薬の適切な管理と更新',
                    '健康に関する情報共有と相談体制の維持',
                    '予防接種や定期健診のスケジュール管理'
                ]
            });
        } else if (!hasSupport && homeRemediesLevel <= 2) {
            // 孤立状況での予防強化
            recommendations.push({
                title: '🛡️ 一人暮らしの健康管理強化',
                content: `${situationAnalysis.positive}一人で健康管理をしている状況ですね。緊急時に備えたサポート体制を構築しながら、日常の健康維持を強化しましょう。`,
                actions: [
                    '近隣医療機関の連絡先リストを作成',
                    '基本的な常備薬セットを準備',
                    '緊急時連絡先の複数確保',
                    '健康管理アプリや記録ツールの活用'
                ]
            });
        } else {
            // 一般的な健康維持
            recommendations.push({
                title: '✅ 継続的な健康維持',
                content: `${situationAnalysis.positive}現在の健康状態を維持しながら、より良い健康習慣を身につけましょう。`,
                actions: [
                    '規則正しい生活リズムの確立',
                    'バランスの取れた食事と適度な運動',
                    'ストレス管理と十分な睡眠',
                    '定期的な健康記録の継続'
                ]
            });
        }
    }
    
    return {
        urgencyLevel,
        recommendations,
        situationAnalysis: situationAnalysis.summary,
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
 * 質問回答と健康記録に基づく状況分析コメント生成
 */
function generateSituationAnalysis(answers, recentRecords, hasRecentFever, hasRecentSymptoms) {
    const hasFever = answers.fever?.value === 'はい';
    const isOnMedication = answers.medication?.value === 'はい';
    const homeRemediesLevel = parseInt(answers.homeRemedies?.value || '1');
    const canWalkToHospital = answers.mobility?.value === 'はい';
    const hasSupport = answers.support?.value === 'はい';
    
    let critical = '';
    let moderate = '';
    let positive = '';
    let summary = '';
    
    // 過去の記録分析
    if (recentRecords.length > 0) {
        if (hasRecentFever && hasFever) {
            critical = '過去7日間の記録でも発熱が確認されており、現在も発熱が続いている状況は深刻です。';
            summary = '継続的な発熱パターンが記録されています。';
        } else if (hasRecentSymptoms) {
            moderate = '過去の記録で症状が見られ、現在の状況と合わせて注意深い観察が必要です。';
            summary = '最近の症状パターンから継続的な注意が必要です。';
        } else {
            positive = '過去の記録は良好で、現在も症状がない理想的な状態です。';
            summary = '継続的に良好な健康状態が維持されています。';
        }
    } else {
        if (hasFever) {
            critical = '健康記録がない中での発熱は状況把握が困難です。';
            summary = '初回の症状記録として重要な情報です。';
        } else {
            positive = '健康記録の開始とともに良好な状態からスタートできています。';
            summary = '健康管理の良いスタートが切れています。';
        }
    }
    
    // 環境分析の追加
    const environmentFactors = [];
    if (!hasSupport) environmentFactors.push('一人での対応');
    if (!canWalkToHospital) environmentFactors.push('移動制限');
    if (homeRemediesLevel <= 2) environmentFactors.push('常備薬不足');
    if (isOnMedication) environmentFactors.push('現在服薬中');
    
    if (environmentFactors.length > 0) {
        const envText = `（${environmentFactors.join('、')}の状況）`;
        critical += envText;
        moderate += envText;
        summary += ` ${envText}`;
    }
    
    return { critical, moderate, positive, summary };
}

/**
 * 個別化された診断結果を表示
 * - 状況分析コメントを含む詳細な診断結果
 * - 質問回答に基づく個別対応アドバイス
 */
function showDiagnosisResult(diagnosis) {
    // 質問セクションを非表示、結果セクションを表示
    document.getElementById('ai-diagnosis-questions').classList.add('hidden');
    document.getElementById('ai-diagnosis-result').classList.remove('hidden');
    
    const diagnosisContent = document.getElementById('diagnosis-content');
    diagnosisContent.innerHTML = '';
    
    // 状況分析サマリーを表示
    if (diagnosis.situationAnalysis) {
        const analysisCard = document.createElement('div');
        analysisCard.className = `diagnosis-card analysis-summary urgency-${diagnosis.urgencyLevel}`;
        analysisCard.innerHTML = `
            <h4>🔍 あなたの状況分析</h4>
            <p class="situation-text">${diagnosis.situationAnalysis}</p>
        `;
        diagnosisContent.appendChild(analysisCard);
    }
    
    // 健康記録サマリーを表示（データがある場合のみ）
    if (diagnosis.healthSummary.recentRecords > 0) {
        const summaryCard = document.createElement('div');
        summaryCard.className = 'diagnosis-card health-summary';
        
        // 記録データに基づく詳細分析
        const feverStatus = diagnosis.healthSummary.hasRecentFever ?
            `<span class="warning-text">発熱の記録あり（要注意）</span>` :
            `<span class="normal-text">発熱の記録なし</span>`;
            
        const symptomsStatus = diagnosis.healthSummary.hasRecentSymptoms ?
            `<span class="warning-text">症状の記録あり（のど・鼻）</span>` :
            `<span class="normal-text">症状の記録なし</span>`;
        
        summaryCard.innerHTML = `
            <h4>📊 過去7日間の健康記録分析</h4>
            <div class="health-metrics">
                <p><strong>記録継続日数:</strong> ${diagnosis.healthSummary.recentRecords}日分（素晴らしい継続記録です！）</p>
                <p><strong>平均体温:</strong> ${diagnosis.healthSummary.averageTemperature}℃</p>
                <p><strong>発熱傾向:</strong> ${feverStatus}</p>
                <p><strong>症状傾向:</strong> ${symptomsStatus}</p>
            </div>
            <p class="data-insight">この記録データが今回の診断精度向上に大いに役立っています。</p>
        `;
        diagnosisContent.appendChild(summaryCard);
    } else {
        // 初回利用者向けのメッセージ
        const welcomeCard = document.createElement('div');
        welcomeCard.className = 'diagnosis-card welcome-card';
        welcomeCard.innerHTML = `
            <h4>🌟 健康記録の開始</h4>
            <p>今回が初めての診断ですね。これから継続的に健康記録をつけることで、より精度の高い個別診断が可能になります。</p>
            <p class="encourage-text">定期的な記録により、あなた専用の健康パターン分析ができるようになります。</p>
        `;
        diagnosisContent.appendChild(welcomeCard);
    }
    
    // 個別化された推奨事項を表示
    diagnosis.recommendations.forEach((recommendation, index) => {
        const card = document.createElement('div');
        card.className = `diagnosis-card recommendation-card urgency-${diagnosis.urgencyLevel}`;
        
        const actionsHtml = recommendation.actions.map((action, actionIndex) =>
            `<li class="action-item priority-${actionIndex + 1}">${action}</li>`
        ).join('');
        
        // 緊急度に応じたアイコンとスタイル
        const urgencyIcon = diagnosis.urgencyLevel === 'high' ? '🚨' :
                           diagnosis.urgencyLevel === 'medium' ? '⚠️' : '✅';
        
        card.innerHTML = `
            <div class="recommendation-header">
                <h4>${recommendation.title}</h4>
                <span class="urgency-badge">${urgencyIcon}</span>
            </div>
            <div class="recommendation-content">
                <p class="recommendation-description">${recommendation.content}</p>
                <div class="action-list-container">
                    <h5>📋 具体的な行動計画：</h5>
                    <ol class="action-list">${actionsHtml}</ol>
                </div>
            </div>
        `;
        
        diagnosisContent.appendChild(card);
    });
    
    // 次回に向けたアドバイス
    const nextStepsCard = document.createElement('div');
    nextStepsCard.className = 'diagnosis-card next-steps';
    
    const nextStepsContent = diagnosis.urgencyLevel === 'high' ?
        '症状の改善後は、回復過程も記録して健康パターンを把握しましょう。' :
        diagnosis.urgencyLevel === 'medium' ?
        '今後も定期的な健康記録で、症状の早期発見と適切な対応を心がけましょう。' :
        '現在の良好な状態を維持するため、継続的な健康記録をお勧めします。';
    
    nextStepsCard.innerHTML = `
        <h4>🔮 今後の健康管理アドバイス</h4>
        <p>${nextStepsContent}</p>
        <p class="app-promotion">このアプリの健康記録機能を活用して、あなただけの健康パターンを見つけていきましょう。</p>
    `;
    diagnosisContent.appendChild(nextStepsCard);
    
    // 免責事項（より親しみやすく）
    const disclaimerCard = document.createElement('div');
    disclaimerCard.className = 'diagnosis-card disclaimer';
    disclaimerCard.innerHTML = `
        <h4>⚠️ 大切なお知らせ</h4>
        <div class="disclaimer-content">
            <p>この診断結果は、あなたの回答と健康記録に基づく<strong>参考情報</strong>です。</p>
            <p>医師による正式な診断に代わるものではありません。</p>
            <p class="medical-advice">心配な症状がある場合や緊急時は、迷わず医療機関を受診してください。</p>
        </div>
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