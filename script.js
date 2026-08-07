const c = document.getElementById("view");
const ctx = c.getContext("2d");

let ORI = "Z";

function setOri(o) {
    ORI = o;
    document.querySelectorAll(".ori button").forEach(b => b.classList.remove("active"));
    document.getElementById("o" + o).classList.add("active");
}

// ================= VOICE =================
let recognition;

function startVoice(inputId) {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Trình duyệt không hỗ trợ Voice");
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.lang = "vi-VN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = function (event) {
        let text = event.results[0][0].transcript;
        console.log("Voice:", text);

        let value = parseVietnameseNumber(text);
        document.getElementById(inputId).value = value;
    };

    recognition.start();
}

// ================= PARSE NUMBER (QUAN TRỌNG) =================
function parseVietnameseNumber(text) {
    text = text.toLowerCase().trim();

    // Chuẩn hóa dấu
    text = text.replace(/,/g, '.');

    // Xử lý số âm
    let negative = false;
    if (text.includes("âm") || text.includes("trừ") || text.startsWith("-")) {
        negative = true;
    }

    // Bảng số
    const numMap = {
        "không": 0, "linh": 0, "lẻ": 0,
        "một": 1, "mốt": 1,
        "hai": 2,
        "ba": 3,
        "bốn": 4, "tư": 4,
        "năm": 5, "lăm": 5,
        "sáu": 6,
        "bảy": 7,
        "tám": 8,
        "chín": 9
    };

    let tokens = text.split(/\s+/);

    let total = 0;
    let current = 0;

    tokens.forEach(word => {
        if (numMap[word] !== undefined) {
            current += numMap[word];
        }
        else if (word === "mười") {
            current = current === 0 ? 10 : current * 10;
        }
        else if (word === "trăm") {
            current *= 100;
        }
        else if (word === "nghìn" || word === "ngàn") {
            total += current * 1000;
            current = 0;
        }
        else if (word === "triệu") {
            total += current * 1000000;
            current = 0;
        }
        else if (word === "tỷ") {
            total += current * 1000000000;
            current = 0;
        }
    });

    total += current;

    // ================= THẬP PHÂN =================
    if (text.includes("phẩy") || text.includes(".")) {
        let parts = text.split(/phẩy|\./);
        let intPart = parseVietnameseNumber(parts[0].replace("âm", "").trim());
        let decimalWords = parts[1].trim().split(/\s+/);

        let decimalStr = "";
        decimalWords.forEach(w => {
            if (numMap[w] !== undefined) {
                decimalStr += numMap[w];
            }
        });

        let result = parseFloat(intPart + "." + decimalStr);
        return negative ? -result : result;
    }

    return negative ? -total : total;
}

// ================= DRAW (GIỮ NGUYÊN) =================
function draw() {
    ctx.clearRect(0, 0, c.width, c.height);

    let px = parseFloat(document.getElementById("px").value) || 0;
    let py = parseFloat(document.getElementById("py").value) || 0;
    let pz = parseFloat(document.getElementById("pz").value) || 0;

    let w = parseFloat(document.getElementById("w").value) || 1000;
    let h = parseFloat(document.getElementById("h").value) || 1000;

    ctx.strokeStyle = "#000";
    ctx.strokeRect(100 + px * 0.1, 50 + py * 0.1, w * 0.1, h * 0.1);

    ctx.fillText(`ORI: ${ORI}`, 10, 20);
}

// ================= AUTO UPDATE =================
document.querySelectorAll("input").forEach(i => {
    i.addEventListener("input", draw);
});

draw();
