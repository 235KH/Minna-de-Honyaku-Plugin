// ==UserScript==
// @name         翻译自动读入
// @namespace    https://chat.openai.com/c/a5d08583-0401-468a-9458-508d3fe5f7bf
// @version      0.1
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


function edit_initial() {
    // Create a button
    var button = document.createElement("button");
    button.innerHTML = "自动读入";
    button.onclick = auto_fill_in;

    // Check if the element exists
    var div = document.getElementsByClassName("c2mzlmy")[0];
    if (div) {
        // Add the button after the div
        div.parentNode.insertBefore(button, div.nextSibling);
        return; // We're done here
    }

    // If the element does not exist, create a mutation observer to monitor the document
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                var div = document.getElementsByClassName("c2mzlmy")[0];
                if (div) {
                    // Add the button after the div
                    div.parentNode.insertBefore(button, div.nextSibling);
                    // Disconnect the observer when done
                    observer.disconnect();
                    clearTimeout(failureTimeout);
                }
            }
        });
    });

    // Start observing the document
    observer.observe(document, { childList: true, subtree: true });

    // Set a timeout to stop the observer if the element is not found within 5 seconds
    var failureTimeout = setTimeout(function() {
        observer.disconnect();
        console.log("Element not found. Disconnecting observer.");
    }, 5000);
}



function track_initial() {
    let button1 = document.querySelector(".c524m7h");
    if (button1) {
        createCheckboxAndLabel();
        button1.addEventListener("click", function() {
            let auto = document.querySelector("#autoCheckbox").checked;
            if (auto) {
                track_fill_in();
            }
        });
    } else {
        const observer = new MutationObserver((mutations, observer) => {
            button1 = document.querySelector(".c524m7h");
            if (button1) {
                createCheckboxAndLabel();
                button1.addEventListener("click", function() {
                    let auto = document.querySelector("#autoCheckbox").checked;
                    if (auto) {
                        track_fill_in();
                    }
                });
                observer.disconnect();
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    }
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






function extractCoreTitle(title) {
    let match = title.match(/[\u4e00-\u9faf\u3040-\u30ff]+/);
    return match ? match[0] : '';
}

function auto_fill_in() {
    var buttons = document.getElementsByClassName("c1t441u1");
    for (var i = 0; i < buttons.length; i++) {
        var title = buttons[i].getElementsByClassName("cei72zy")[0].innerText;
        var url = buttons[i].getElementsByTagName("a")[0].href;
        var coreTitle = extractCoreTitle(title);
        console.log("Title: " + title + ", URL: " + url + ", Core title: " + coreTitle);
    }
}


function track_fill_in() {
    console.log("开始自动填充");
    const observer = new MutationObserver((mutations, observer) => {
        const button2 = document.querySelector(".cwi215f");
        if (button2) {
            button2.click();
            observer.disconnect();
            const observer2 = new MutationObserver((mutations, observer2) => {
                const labels = document.querySelectorAll(".cmh4duu label");
                const pageTitle = document.querySelector(".c14qfzdu").innerText;
                const corePageTitle = extractCoreTitle(pageTitle);
                console.log("当前匹配：" + corePageTitle);
                let matchedLabel = null;
                console.log("寻找列表…");
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
                        }
                    }, 500); // 0.5秒后点击読み込む按钮
                    setTimeout(function() {
                        const confirmButton = document.querySelector('button[aria-label="読み込む"]');
                        if (confirmButton) {
                            confirmButton.click();
                        }
                    }, 1000); // 1秒后点击読み込む按钮
                    setTimeout(function() {
                        const confirmButton = document.querySelector('button[aria-label="保存"]');
                        if (confirmButton) {
                            confirmButton.click();
                            console.log(matchedLabel.innerText + "自动填充成功！");
                        }
                    }, 2000); // 2秒后点击确认按钮


                } else {
                    console.log("无匹配标签");
                }
                observer2.disconnect();
            });
            observer2.observe(document, { childList: true, subtree: true });

        }
    });
    observer.observe(document, { childList: true, subtree: true });
}

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
            console.log("页面已切换 " + switchCount + " 次");

            if (location.href.includes("/track/")) {
                track_initial();
                console.log("---------Track Page---------");
            } else {
                edit_initial();
                console.log("---------Edit Page---------");
            }
        }
    }, 1000); // Check every second

})();
