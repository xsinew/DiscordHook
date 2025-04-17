class MacWindow {
    constructor(options = {}) {
        this.options = {
            title: options.title || '설정',
            width: options.width || 800,
            height: options.height || 500
        };

        this.tabs = [];
        this.currentTab = null;
        this.loadStyles();
        this.init();
    }

    loadStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .mac-settings-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                display: none;
            }

            .mac-settings-window {
                background-color: rgba(30, 30, 30, 0.8);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border-radius: 10px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                position: absolute;
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                border: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                color: #fff;
            }

            .mac-settings-sidebar {
                width: 200px;
                background: rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(20px) saturate(150%);
                -webkit-backdrop-filter: blur(20px) saturate(150%);
                border-right: 1px solid rgba(255, 255, 255, 0.1);
                padding: 20px 0;
                cursor: move;
                box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
            }

            .mac-settings-sidebar::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(
                    to right,
                    rgba(0, 0, 0, 0.05),
                    rgba(0, 0, 0, 0.02)
                );
                pointer-events: none;
            }

            .mac-settings-sidebar-item {
                padding: 8px 15px;
                font-size: 13px;
                color: rgba(255, 255, 255, 0.7);
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                position: relative;
                z-index: 1;
            }

            .mac-settings-sidebar-item:hover {
                background-color: rgba(255, 255, 255, 0.05);
            }

            .mac-settings-sidebar-item.active {
                background-color: rgba(200, 180, 255, 0.1);
                color: #fff;
            }

            .mac-settings-sidebar-item.active:hover {
                background-color: rgba(200, 180, 255, 0.15);
            }

            .mac-settings-sidebar-item.active::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 3px;
                background-color: #c4b4ff;
                border-radius: 0 2px 2px 0;
                opacity: 0.8;
            }

            .mac-settings-content {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
            }

            .mac-settings-tab-content {
                display: none;
            }

            .mac-settings-tab-content.active {
                display: block;
            }

            .mac-settings-section {
                margin-bottom: 25px;
            }

            .mac-settings-section-title {
                font-size: 16.9px;
                font-weight: 600;
                color: #fff;
                margin-bottom: 10px;
            }

            .mac-settings-control-group {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
            }

            .mac-settings-control-label {
                width: 120px;
                font-size: 13px;
                color: #fff;
            }

            /* 버튼 스타일 */
            .mac-settings-button {
                background: linear-gradient(to bottom, #2c2c2c, #1f1f1f);
                border: 1px solid #404040;
                border-radius: 4px;
                padding: 4px 12px;
                font-size: 13px;
                color: #fff;
                cursor: pointer;
                box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
                transition: all 0.2s;
            }

            .mac-settings-button:hover {
                background: linear-gradient(to bottom, #363636, #2a2a2a);
            }

            .mac-settings-button:active {
                background: linear-gradient(to bottom, #1f1f1f, #2c2c2c);
            }

            /* 토글 스타일 */
            .mac-settings-toggle {
                position: relative;
                width: 40px;
                height: 20px;
            }

            .mac-settings-toggle input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .mac-settings-toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #404040;
                transition: .4s;
                border-radius: 20px;
            }

            .mac-settings-toggle-slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 2px;
                bottom: 2px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }

            .mac-settings-toggle input:checked + .mac-settings-toggle-slider {
                background-color: #c4b4ff;
            }

            .mac-settings-toggle input:checked + .mac-settings-toggle-slider:before {
                transform: translateX(20px);
            }

            /* 슬라이더 스타일 */
            .mac-settings-slider {
                -webkit-appearance: none;
                width: 200px;
                height: 4px;
                background: #404040;
                border-radius: 2px;
                outline: none;
                background-image: linear-gradient(#c4b4ff, #c4b4ff);
                background-size: 0% 100%;
                background-repeat: no-repeat;
            }

            .mac-settings-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 24px;
                height: 12px;
                background: #c4b4ff;
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                z-index: 1;
            }

            .mac-settings-slider::-moz-range-thumb {
                width: 24px;
                height: 12px;
                background: #c4b4ff;
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                z-index: 1;
                border: none;
            }

            .mac-settings-slider::-webkit-slider-runnable-track {
                -webkit-appearance: none;
                box-shadow: none;
                border: none;
                background: transparent;
            }

            .mac-settings-slider::-moz-range-track {
                box-shadow: none;
                border: none;
                background: transparent;
            }

            /* 텍스트 입력 스타일 */
            .mac-settings-input {
                width: 200px;
                padding: 4px 8px;
                font-size: 13px;
                border: 1px solid #404040;
                border-radius: 4px;
                background-color: #2c2c2c;
                outline: none;
                color: #fff;
            }

            .mac-settings-input:focus {
                border-color: #c4b4ff;
                box-shadow: 0 0 0 2px rgba(196, 180, 255, 0.2);
            }

            /* 드롭다운 스타일 */
            .mac-settings-select {
                width: 200px;
                padding: 4px 8px;
                font-size: 13px;
                border: 1px solid #404040;
                border-radius: 4px;
                background-color: #2c2c2c;
                outline: none;
                cursor: pointer;
                color: #fff;
            }

            .mac-settings-select:focus {
                border-color: #c4b4ff;
                box-shadow: 0 0 0 2px rgba(196, 180, 255, 0.2);
            }

            /* 드롭다운 옵션 스타일 */
            .mac-settings-select option {
                background-color: #2c2c2c;
                color: #fff;
            }

            .mac-settings-window * {
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
            }

            .mac-settings-slider-value {
                margin-left: 10px;
                font-size: 13px;
                color: #fff;
                min-width: 30px;
                text-align: right;
            }
        `;
        document.head.appendChild(style);
    }

    init() {
        // 오버레이 생성
        this.overlay = document.createElement('div');
        this.overlay.className = 'mac-settings-overlay';
        document.body.appendChild(this.overlay);

        // 메인 윈도우 생성
        this.window = document.createElement('div');
        this.window.className = 'mac-settings-window';
        this.window.style.width = `${this.options.width}px`;
        this.window.style.height = `${this.options.height}px`;
        this.overlay.appendChild(this.window);

        // 사이드바 생성
        this.sidebar = document.createElement('div');
        this.sidebar.className = 'mac-settings-sidebar';
        this.window.appendChild(this.sidebar);

        // 컨텐츠 영역 생성
        this.content = document.createElement('div');
        this.content.className = 'mac-settings-content';
        this.window.appendChild(this.content);

        this.setupEventListeners();
    }

    createTab(options = {}) {
        const tab = new MacTab(this, options);
        this.tabs.push(tab);
        return tab;
    }

    setupEventListeners() {
        // 드래그 기능
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        this.sidebar.addEventListener('mousedown', (e) => {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === this.sidebar || e.target.closest('.mac-settings-sidebar')) {
                isDragging = true;
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                this.window.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    show() {
        this.overlay.style.display = 'flex';
        return this;
    }

    hide() {
        this.overlay.style.display = 'none';
        return this;
    }

    destroy() {
        this.overlay.remove();
    }
}

class MacTab {
    constructor(window, options = {}) {
        this.window = window;
        this.options = {
            title: options.title || '새 탭',
            id: options.id || `tab-${Date.now()}`
        };

        this.controls = [];
        this.init();
    }

    init() {
        // 사이드바 아이템 생성
        this.sidebarItem = document.createElement('div');
        this.sidebarItem.className = 'mac-settings-sidebar-item';
        this.sidebarItem.textContent = this.options.title;
        this.sidebarItem.dataset.tab = this.options.id;
        this.window.sidebar.appendChild(this.sidebarItem);

        // 탭 컨텐츠 생성
        this.content = document.createElement('div');
        this.content.className = 'mac-settings-tab-content';
        this.content.id = this.options.id;
        this.window.content.appendChild(this.content);

        // 첫 번째 탭인 경우 활성화
        if (this.window.tabs.length === 1) {
            this.activate();
        }

        this.sidebarItem.addEventListener('click', () => this.activate());
    }

    activate() {
        // 모든 탭 비활성화
        this.window.tabs.forEach(tab => tab.deactivate());
        
        // 현재 탭 활성화
        this.sidebarItem.classList.add('active');
        this.content.classList.add('active');
        this.window.currentTab = this;
    }

    deactivate() {
        this.sidebarItem.classList.remove('active');
        this.content.classList.remove('active');
    }

    createSection(title) {
        const section = new MacSection(this, title);
        return section;
    }

    createButton(options = {}) {
        const button = new MacButton(this, options);
        this.controls.push(button);
        this.content.appendChild(button.element);
        return button;
    }

    createToggle(options = {}) {
        const toggle = new MacToggle(this, options);
        this.controls.push(toggle);
        this.content.appendChild(toggle.element);
        return toggle;
    }

    createSlider(options = {}) {
        const slider = new MacSlider(this, options);
        this.controls.push(slider);
        this.content.appendChild(slider.element);
        return slider;
    }

    createInput(options = {}) {
        const input = new MacInput(this, options);
        this.controls.push(input);
        this.content.appendChild(input.element);
        return input;
    }

    createSelect(options = {}) {
        const select = new MacSelect(this, options);
        this.controls.push(select);
        this.content.appendChild(select.element);
        return select;
    }
}

class MacSection {
    constructor(tab, title) {
        this.tab = tab;
        this.title = title;
        this.controls = [];
        this.init();
    }

    init() {
        this.element = document.createElement('div');
        this.element.className = 'mac-settings-section';
        
        const titleElement = document.createElement('div');
        titleElement.className = 'mac-settings-section-title';
        titleElement.textContent = this.title;
        this.element.appendChild(titleElement);

        this.tab.content.appendChild(this.element);
    }

    createButton(options = {}) {
        const button = new MacButton(this.tab, options);
        this.controls.push(button);
        this.element.appendChild(button.element);
        return button;
    }

    createToggle(options = {}) {
        const toggle = new MacToggle(this.tab, options);
        this.controls.push(toggle);
        this.element.appendChild(toggle.element);
        return toggle;
    }

    createSlider(options = {}) {
        const slider = new MacSlider(this.tab, options);
        this.controls.push(slider);
        this.element.appendChild(slider.element);
        return slider;
    }

    createInput(options = {}) {
        const input = new MacInput(this.tab, options);
        this.controls.push(input);
        this.element.appendChild(input.element);
        return input;
    }

    createSelect(options = {}) {
        const select = new MacSelect(this.tab, options);
        this.controls.push(select);
        this.element.appendChild(select.element);
        return select;
    }
}

class MacControl {
    constructor(tab, options = {}) {
        this.tab = tab;
        this.options = options;
        this.init();
    }

    init() {
        this.element = document.createElement('div');
        this.element.className = 'mac-settings-control-group';

        const label = document.createElement('div');
        label.className = 'mac-settings-control-label';
        label.textContent = this.options.label || '';
        this.element.appendChild(label);
    }
}

class MacButton extends MacControl {
    constructor(tab, options = {}) {
        super(tab, options);
        this.initButton();
    }

    initButton() {
        const button = document.createElement('button');
        button.className = 'mac-settings-button';
        button.textContent = this.options.text || '버튼';
        if (this.options.callback) {
            button.addEventListener('click', this.options.callback);
        }
        this.element.appendChild(button);
    }
}

class MacToggle extends MacControl {
    constructor(tab, options = {}) {
        super(tab, options);
        this.initToggle();
    }

    initToggle() {
        const label = document.createElement('label');
        label.className = 'mac-settings-toggle';

        const input = document.createElement('input');
        input.type = 'checkbox';
        if (this.options.checked) input.checked = true;
        if (this.options.callback) {
            input.addEventListener('change', (e) => this.options.callback(e.target.checked));
        }

        const slider = document.createElement('span');
        slider.className = 'mac-settings-toggle-slider';

        label.appendChild(input);
        label.appendChild(slider);
        this.element.appendChild(label);
    }

    toggle() {
        const input = this.element.querySelector('input');
        input.checked = !input.checked;
        input.dispatchEvent(new Event('change'));
    }
}

class MacSlider extends MacControl {
    constructor(tab, options = {}) {
        super(tab, options);
        this.initSlider();
    }

    initSlider() {
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'mac-settings-slider';
        slider.min = this.options.min || 0;
        slider.max = this.options.max || 100;
        slider.value = this.options.value || 50;
        slider.step = 1;

        // 초기 배경 크기 설정
        const percentage = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        slider.style.backgroundSize = `${percentage}% 100%`;

        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'mac-settings-slider-value';
        valueDisplay.textContent = slider.value;

        if (this.options.callback) {
            slider.addEventListener('input', (e) => {
                const percentage = (e.target.value - e.target.min) / (e.target.max - e.target.min) * 100;
                e.target.style.backgroundSize = `${percentage}% 100%`;
                valueDisplay.textContent = e.target.value;
                this.options.callback(e.target.value);
            });
        }

        this.element.appendChild(slider);
        this.element.appendChild(valueDisplay);
    }
}

class MacInput extends MacControl {
    constructor(tab, options = {}) {
        super(tab, options);
        this.initInput();
    }

    initInput() {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'mac-settings-input';
        input.placeholder = this.options.placeholder || '';
        input.value = this.options.value || '';
        if (this.options.callback) {
            input.addEventListener('input', (e) => this.options.callback(e.target.value));
        }
        this.element.appendChild(input);
    }
}

class MacSelect extends MacControl {
    constructor(tab, options = {}) {
        super(tab, options);
        this.initSelect();
    }

    initSelect() {
        const select = document.createElement('select');
        select.className = 'mac-settings-select';
        (this.options.options || []).forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            select.appendChild(optionElement);
        });
        if (this.options.callback) {
            select.addEventListener('change', (e) => this.options.callback(e.target.value));
        }
        this.element.appendChild(select);
    }
} 
