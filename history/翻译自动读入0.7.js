// ==UserScript==
// @name         翻译自动读入
// @namespace    https://github.com/235KH/Minna-de-Honyaku-Plugin
// @version      0.7
// @description  A script to add a button and print button names and URLs
// @author       空白Sora
// @match        https://www.dlsite.com/circle/translation/sound/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dlsite.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.log("脚本已启用");
    let currentUrl = location.href;
    let switchCount = 0;
    let autoCheckboxState = false;
    let fullAutoCheckboxState = false;
    let recentlyClicked = false;

    function edit_initial() {
        recentlyClicked = true; 
        const div = document.getElementsByClassName("c2mzlmy")[0];
        if (div) {
            createEditCheckboxAndLabel();
            add_tag();
            setInterval(auto_click, 1000);
        } else {
            const observer = new MutationObserver((mutations, observer) => {
                const div = document.getElementsByClassName("c2mzlmy")[0];
                if (div) {
                    createEditCheckboxAndLabel();
                    add_tag();
                    observer.disconnect();
                    setInterval(auto_click, 1000);
                }
            });
            observer.observe(document, { childList: true, subtree: true });
        }
    }

    function createEditCheckboxAndLabel() {
        // Create the checkbox
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'fullAutoCheckbox';
        checkbox.checked = fullAutoCheckboxState;
        checkbox.style.width = '20px';
        checkbox.style.height = '20px';
        checkbox.style.marginRight = '16px';
        checkbox.style.verticalAlign = 'middle';
        checkbox.addEventListener('change', function() {
            fullAutoCheckboxState = this.checked;
        });
    
        // Create the label
        let label = document.createElement('label');
        label.htmlFor = 'fullAutoCheckbox';
        label.textContent = '全自动读入';
        label.style.color = 'rgb(23, 161, 230)';
        label.style.marginLeft = '15px';
        label.style.verticalAlign = 'middle';
    
        // Create the button for "一键填充差分"
        let fillButton = document.createElement('button');
        fillButton.textContent = '一键填充差分';
        fillButton.style.backgroundColor = 'rgb(23, 161, 230)';
        fillButton.style.color = 'white';
        fillButton.style.border = 'none';
        fillButton.style.marginLeft = '20px';
        fillButton.style.verticalAlign = 'middle';
        fillButton.style.padding = '5px 15px';  // Add padding around the text
        fillButton.style.borderRadius = '5px';  // Rounded corners
        //fillButton.style.fontSize = '14px';  // Adjust font size if needed
        fillButton.style.cursor = 'pointer';  // Change the mouse cursor to pointer when hovering over the button
        fillButton.onclick = auto_fill_in;
            // Event listener to change the background color when mouse enters
        fillButton.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgb(92, 189, 237)';  // Slightly lighter color
        });

        // Event listener to revert the background color when mouse leaves
        fillButton.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'rgb(23, 161, 230)';
        });
    
        
        // Insert the checkbox, the label, and the button
        let container = document.createElement('div');
        container.appendChild(label);
        container.appendChild(checkbox);
        container.appendChild(fillButton);
        let div = document.getElementsByClassName("c2mzlmy")[0];
        div.parentNode.insertBefore(container, div.nextSibling);
    }

    function extractCoreTitle(title) {
        let match = title.match(/^.*?[\u4e00-\u9faf\u3040-\u30ff]+/);
        return match ? match[0] : '';
    }
    
    
    function auto_fill_in() {
        // 检测localStorage中是否还残留markedTracks
        var existingMarkedTracks = JSON.parse(localStorage.getItem('markedTracks') || '[]');
        if (existingMarkedTracks.length > 0) {
            var userChoice = confirm("填充未完成，是否重置？");
            if (userChoice) {
                // 用户选择重置，所以清除markedTracks
                localStorage.removeItem('markedTracks');
            } else {
                return; // 如果用户选择不重置，则直接返回并不执行以下操作
            }
        }
    
        var buttons = document.getElementsByClassName("c1t441u1");
        var seenTitles = {}; // 用来记录已经看到的coreTitle
        var markedTrackIndices = []; // 用于存储需要标记的tracks的编号
    
        for (var i = 0; i < buttons.length; i++) {
            var title = buttons[i].getElementsByClassName("cei72zy")[0].innerText;
            var coreTitle = extractCoreTitle(title);
    
            if (seenTitles[coreTitle]) {
                // 如果已经看到过这个coreTitle，将其编号存储
                markedTrackIndices.push(i);
                // console.log("标记: " + title);
            } else {
                // 如果是第一次看到这个coreTitle，将其加入到seenTitles中
                seenTitles[coreTitle] = true;
            }
        }
    
        // 将标记的tracks编号存储到localStorage中
        localStorage.setItem('markedTracks', JSON.stringify(markedTrackIndices));
    
        // 标记tracks
        add_tag();
        console.log("已添加标记");
    }
    
    
    function add_tag() {
        const markedTrackIndices = JSON.parse(localStorage.getItem('markedTracks') || '[]');
        const buttons = document.getElementsByClassName("c1t441u1");
        
        for (const index of markedTrackIndices) {
            const button = buttons[index];
            const liElement = button.getElementsByClassName("cni3j4w")[0];
    
            // 设置“▶”并给它相应的样式
            liElement.innerText = '▶';
            liElement.style.color = 'rgb(23, 161, 230)';
        }
    }
    
    
    function auto_click() {
        if (!recentlyClicked) {
            return; // 如果最近已经点击过，直接返回不执行后续逻辑
        }
    
        if (fullAutoCheckboxState) {
            const markedTrackIndices = JSON.parse(localStorage.getItem('markedTracks') || '[]');
            if (markedTrackIndices.length > 0) {
                const firstMarkedTrackIndex = markedTrackIndices[0];
                markedTrackIndices.shift();  // 删除第一个元素
    
                // 获取该索引对应的按钮并提取出链接和标题
                const buttons = document.getElementsByClassName("c1t441u1");
                const firstMarkedButton = buttons[firstMarkedTrackIndex];
                const trackURL = firstMarkedButton.getElementsByTagName("a")[0].href;
                const title = firstMarkedButton.getElementsByClassName("cei72zy")[0].innerText;
    
                // 更新localStorage中的markedTrackIndices
                localStorage.setItem('markedTracks', JSON.stringify(markedTrackIndices));
    
                // 更新点击状态
                recentlyClicked = false;
    
                // 输出信息到控制台并在1秒后进行导航
                console.log("跳转到：" + title);
                setTimeout(function() {
                    window.location.href = trackURL;
                }, 1000);
            }
        }
    }
    




function track_initial() {
    let button1 = document.querySelector(".c524m7h"); //翻訳データ読み込み
    if (button1) {
        createCheckboxAndLabel();
        createExportButton();
        button1.addEventListener("click", function() {
            if (autoCheckboxState) {
                track_fill_in(); //他トラックの翻訳を読み込む
            }
        });
    } else {
        const observer = new MutationObserver((mutations, observer) => {
            button1 = document.querySelector(".c524m7h");
            if (button1) {
                createCheckboxAndLabel();
                createExportButton();
                button1.addEventListener("click", function() {
                    if (autoCheckboxState) {
                        track_fill_in();
                    }
                });
                observer.disconnect();
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    }
    setTimeout(function() {
        if (fullAutoCheckboxState) {
            autoCheckboxState = true;
            button1.click();
        }
    }, 1500); // 1.5秒后点击読み込む按钮

}

function createCheckboxAndLabel() {
    // Create the checkbox
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'autoCheckbox';
    checkbox.checked = autoCheckboxState; //使用全局变量的值来设置复选框状态
    checkbox.style.width = '20px';
    checkbox.style.height = '20px';
    checkbox.style.marginRight = '16px'
    checkbox.style.verticalAlign = 'middle';
    checkbox.addEventListener('change', function() {
        autoCheckboxState = this.checked; //更新全局变量
    });

    // Create the label
    let label = document.createElement('label');
    label.htmlFor = 'autoCheckbox';
    label.textContent = '自动读入';
    label.style.color = 'rgb(23, 161, 230)';
    label.style.marginLeft = '5px';
    label.style.verticalAlign = 'middle';

    // Insert the checkbox and the label to the left of the button1's parent
    let container = document.createElement('div');
    container.appendChild(label);
    container.appendChild(checkbox);
    let parentElement = document.querySelector(".c1yqlmpd");
    parentElement.insertBefore(container, parentElement.firstChild);
}

function createExportButton() {
    // 定位到目标元素
    const targetElement = document.querySelector(".m1cgy15s");

    // 创建新的按钮元素
    const exportButtonDiv = document.createElement("div");
    //exportButtonDiv.className = "c1pz8tnv";
    exportButtonDiv.style.cursor = "pointer";

    const exportButton = document.createElement("button");
    exportButton.className = "m1cgy15s";
    exportButton.tabIndex = "0";
    exportButton.setAttribute("aria-label", "导出");

    const exportSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    exportSvg.setAttribute("viewBox", "0 0 1024 1024");
    exportSvg.style.display = "inline-block";
    exportSvg.style.width = "1.5em";
    exportSvg.style.height = "1.5em";
    exportSvg.style.verticalAlign = "-0.125em";

    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("d", "M562.996016 643.229748V72.074369a50.996016 50.996016 0 0 0-101.992032 0v571.155379a50.996016 50.996016 0 0 0 101.992032 0z");
    path1.setAttribute("fill", "rgb(23, 161, 230)");

    const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("d", "M513.087915 144.080744L802.337317 432.446215a50.996016 50.996016 0 0 0 71.93838-72.210358L513.087915 0 149.588313 362.411687A50.996016 50.996016 0 0 0 221.594688 434.486056L513.087915 144.148738zM53.035857 643.229748v184.537583c0 109.471448 105.255777 192.832935 230.026029 192.832935h457.876228c124.770252 0 230.026029-83.361487 230.026029-192.832935V643.229748a50.996016 50.996016 0 1 0-101.992031 0v184.537583c0 47.256308-55.075697 90.840903-128.033998 90.840903H283.061886c-72.9583 0-128.033997-43.65259-128.033998-90.840903V643.229748a50.996016 50.996016 0 0 0-101.992031 0z");
    path2.setAttribute("fill", "rgb(23, 161, 230)");

    exportSvg.appendChild(path1);
    exportSvg.appendChild(path2);
    exportButton.appendChild(exportSvg);

    const exportSpan = document.createElement("span");
    //exportSpan.className = "c1ozr2yu";
    exportSpan.textContent = "导出";
    exportButton.style.marginRight = '16px'
    exportButton.style.display = "flex";
    exportButton.style.alignItems = "center";  // 内部元素上下居中


    exportButton.appendChild(exportSpan);
    exportButtonDiv.appendChild(exportButton);

    // 绑定点击事件（将来可以替换为实际的功能函数）
    exportButton.addEventListener('click', function() {
        // 获取所有的字幕条
        let subtitles = document.querySelectorAll('.c1gbe9ro');
        let srtContent = '';
    
        subtitles.forEach((subtitle, index) => {
            // 获取开始和结束时间
            let startTime = subtitle.getAttribute('data-start-time').replace('.', ',');
            let endTime = subtitle.getAttribute('data-end-time').replace('.', ',');
    
            // 尝试获取<c1h4xyym>内的内容，如果为空，则获取<span class="c1yfg28z">的内容
            let contentElement = subtitle.querySelector('.c1h4xyym');
            let content = contentElement ? contentElement.textContent.replace(/\u200B/g, '').trim() : ''; 
            
            if (!content) {
                let spans = subtitle.querySelectorAll('.c1yfg28z');
                content = Array.from(spans).map(span => span.textContent).join(' ');
            }
            
    
            // 构建srt格式的内容
            srtContent += `${index + 1}\n`;
            srtContent += `${startTime} --> ${endTime}\n`;
            srtContent += `${content}\n\n`;
        });
    
        // 保存为srt文件
        let titleElement = document.querySelector('.c15tncc5');
        let titleText = titleElement ? titleElement.textContent.trim() : 'subtitles';
        let blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
        let a = document.createElement('a');
        let url = URL.createObjectURL(blob);
        a.href = url;
        a.download = `${titleText}.srt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    });

    // 在目标元素前插入新创建的导出按钮
    targetElement.parentNode.insertBefore(exportButtonDiv, targetElement);
}





function track_fill_in() {
    console.log("开始自动填充");
    const observer = new MutationObserver((mutations, observer) => {
        const button2 = document.querySelector(".cwi215f"); //他トラックの翻訳を読み込む
        if (button2) {
            button2.click();
            observer.disconnect();
            const observer2 = new MutationObserver((mutations, observer2) => {
                const labels = document.querySelectorAll(".cmh4duu label");
                const pageTitle = document.querySelector(".c14qfzdu").innerText;
                const corePageTitle = extractCoreTitle(pageTitle);
                console.log("当前匹配：" + corePageTitle);
                let matchedLabel = null;
                // console.log("寻找列表…");
                for (const label of labels) {
                    //console.log(label.innerText);
                    if (extractCoreTitle(label.innerText) === corePageTitle) {
                        matchedLabel = label;
                        break;
                    }
                }
                if (matchedLabel) {
                    matchedLabel.click();
                    console.log("匹配标签：" + matchedLabel.innerText);
                    setTimeout(function() {
                        const confirmButton = document.querySelector('button[aria-label="読み込む"]');
                        if (confirmButton) {
                            confirmButton.click();
                        } else {
                            alert("E1:填充失败，请调整音轨或手动填充");
                            fullAutoCheckboxState = false;
                            autoCheckboxState = false;
                        }
                    }, 500); // 0.5秒后点击読み込む按钮
                    setTimeout(function() {
                        const confirmButton = document.querySelector('button[aria-label="読み込む"]');
                        if (confirmButton) {
                            confirmButton.click();
                        } else {
                            alert( "E2:填充失败，请调整音轨或手动填充");
                            fullAutoCheckboxState = false;
                            autoCheckboxState = false;
                        }
                    }, 1000); // 1秒后点击読み込む按钮
                    setTimeout(function() {
                        const confirmButton = document.querySelector('button[aria-label="保存"]:not([disabled])');
                        if (confirmButton) {
                            confirmButton.click();
                            console.log(matchedLabel.innerText + "自动填充成功！");
                            if (fullAutoCheckboxState) {
                                setTimeout(function() {
                                    history.back();
                                    console.log("返回到上一级页面");
                                }, 2000);  // 在所有其他操作完成后稍微等待一下再返回，这里是2.5秒后
                            }
                        } else {
                            alert( "E3:填充失败，请调整音轨或手动填充");
                            fullAutoCheckboxState = false;
                            autoCheckboxState = false;
                        }

                    }, 2000); // 2秒后点击确认按钮
                } else {
                    alert( "E4:填充失败，无匹配音轨");
                    autoCheckboxState = false;
                }
                observer2.disconnect();
            });
            observer2.observe(document, { childList: true, subtree: true });

        }
    });
    observer.observe(document, { childList: true, subtree: true });
}

    // main
    // 检查当前页面类型并执行对应的初始化函数
    if (location.href.includes("/track/")) {
        track_initial();
        console.log("---------Track Page---------");
    } else {
        edit_initial();
        console.log("---------Edit Page---------");
    }

    // 检查URL的变化，并执行相应的初始化函数
    setInterval(function() {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            switchCount++;
            
            if (location.href.includes("/track/")) {
                track_initial();
                console.log("---------Track Page---------");
            } else {
                edit_initial();
                console.log("---------Edit Page---------");
            }
            console.log("页面已切换 " + switchCount + " 次");

        }
    }, 1000); // Check every second

})();
