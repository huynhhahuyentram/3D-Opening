const c = document.getElementById("view");
const ctx = c.getContext("2d");

let ORI = "Z";

/* CHỌN HƯỚNG VÀ VẼ LẠI */
function setOri(o) {
    ORI = o;
    document.querySelectorAll(".ori button").forEach(b => b.classList.remove("active"));
    document.getElementById("o" + o.toLowerCase()).classList.add("active");
    draw();
}

/* HÀM VẼ TỔNG HỢP REAL-TIME */
function draw() {
    // Tự động điều chỉnh kích thước Canvas theo màn hình
    c.width = c.offsetWidth;
    c.height = 280;

    let L = +document.getElementById("dx").value || 0;
    let W = +document.getElementById("dy").value || 0;
    let H = +document.getElementById("dz").value || 0;

    ctx.clearRect(0, 0, c.width, c.height);

    // Vẽ Trục tọa độ theo quy tắc bàn tay phải
    drawAxis();

    // Nếu kích thước = 0 thì không vẽ khối 3D
    if (L === 0 && W === 0 && H === 0) return;

    // Tính toán Tỷ lệ (Scale Auto)
    let maxDim = Math.max(L, W, H, 100);
    let scale = 110 / maxDim;

    let l = L * scale;
    let w = W * scale;
    let h = H * scale;

    // Tọa độ tâm khối 3D trên màn hình
    let cx = c.width / 2;
    let cy = c.height / 2 + 10;

    // Phân chiếu hình học 3D Iso chuẩn theo Orientation
    if (ORI === "Z") {
        // Mặt phẳng L x W nằm trên XY, Đùn H theo Z
        drawIsometricBox(cx, cy, l, w, h, "L = " + L, "W = " + W, "H = " + H);
    } else if (ORI === "X") {
        // Mặt phẳng W x H nằm trên YZ, Đùn L theo X
        drawIsometricBox(cx, cy, w, h, l, "W = " + W, "H = " + H, "L = " + L);
    } else if (ORI === "Y") {
        // Mặt phẳng L x H nằm trên XZ, Đùn W theo Y
        drawIsometricBox(cx, cy, l, h, w, "L = " + L, "H = " + H, "W = " + W);
    }
}

/* TRỤC TỌA ĐỘ THEO QUY TẮC BÀN TAY PHẢI */
function drawAxis() {
    ctx.lineWidth = 2.5;
    ctx.font = "bold 14px Segoe UI";

    let x0 = 50, y0 = 220;

    // Trục X (Đỏ) - Hướng sang phải
    ctx.strokeStyle = "#e74c3c";
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + 50, y0);
    ctx.stroke();
    ctx.fillText("X", x0 + 55, y0 + 5);

    // Trục Y (Xanh nước biển) - Hướng chéo lên
    ctx.strokeStyle = "#2980b9";
    ctx.fillStyle = "#2980b9";
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + 35, y0 - 30);
    ctx.stroke();
    ctx.fillText("Y", x0 + 40, y0 - 32);

    // Trục Z (Xanh lá cây) - Hướng thẳng đứng
    ctx.strokeStyle = "#27ae60";
    ctx.fillStyle = "#27ae60";
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0, y0 - 50);
    ctx.stroke();
    ctx.fillText("Z", x0 - 5, y0 - 55);
}

/* KHỐI 3D ISOMETRIC CHUẨN KHÔNG BỊ TRỒNG NÉT CỮ */
function drawIsometricBox(cx, cy, d1, d2, d3, label1, label2, label3) {
    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 2;
    ctx.fillStyle = "#2c3e50";
    ctx.font = "bold 13px Segoe UI";

    // Chiếu Isometric
    let cos30 = 0.866;
    let sin30 = 0.5;

    // Tọa độ 8 đỉnh khối hộp 3D
    let p0 = { x: cx - (d1 * cos30 - d2 * cos30)/2, y: cy + (d1 * sin30 + d2 * sin30)/2 };
    let p1 = { x: p0.x + d1 * cos30, y: p0.y - d1 * sin30 };
    let p2 = { x: p1.x - d2 * cos30, y: p1.y - d2 * sin30 };
    let p3 = { x: p0.x - d2 * cos30, y: p0.y - d2 * sin30 };

    let p0_top = { x: p0.x, y: p0.y - d3 };
    let p1_top = { x: p1.x, y: p1.y - d3 };
    let p2_top = { x: p2.x, y: p2.y - d3 };
    let p3_top = { x: p3.x, y: p3.y - d3 };

    // Vẽ Mặt trên
    ctx.beginPath();
    ctx.moveTo(p0_top.x, p0_top.y);
    ctx.lineTo(p1_top.x, p1_top.y);
    ctx.lineTo(p2_top.x, p2_top.y);
    ctx.lineTo(p3_top.x, p3_top.y);
    ctx.closePath();
    ctx.stroke();

    // Vẽ Mặt trước trái
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p1_top.x, p1_top.y);
    ctx.lineTo(p0_top.x, p0_top.y);
    ctx.closePath();
    ctx.stroke();

    // Vẽ Mặt trước phải
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p3_top.x, p3_top.y);
    ctx.lineTo(p0_top.x, p0_top.y);
    ctx.closePath();
    ctx.stroke();

    // Ghi nhãn kích thước chuẩn vị trí không chèn vào hình
    ctx.fillText(label1, (p0.x + p1.x) / 2 - 15, (p0.y + p1.y) / 2 + 20);
    ctx.fillText(label2, (p0.x + p3.x) / 2 - 50, (p0.y + p3.y) / 2 + 20);
    ctx.fillText(label3, p0.x - 60, p0.y - d3 / 2);
}

/* KHUNG CHAT VOICE */
function log(t) {
    const chatBox = document.getElementById("chat");
    chatBox.innerHTML += `<div>${t}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
}

/* ĐIỀU KHIỂN GIỌNG NÓI */
function voice() {
    speak("Hãy đọc kích thước dài rộng cao");

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
        alert("Trình duyệt không hỗ trợ Voice!");
        return;
    }

    let r = new SR();
    r.lang = "vi-VN";
    r.continuous = false;

    r.onresult = e => {
        let text = e.results[0][0].transcript;
        process(text);
    };

    r.start();
}

/* XỬ LÝ CHUYỂN GIỌNG NÓI THÀNH SỐ */
function process(t) {
    log("👤 " + t);
    let nums = t.match(/\d+([.,]\d+)?/g);

    if (nums && nums.length >= 3) {
        document.getElementById("dx").value = nums[0].replace(',', '.');
        document.getElementById("dy").value = nums[1].replace(',', '.');
        document.getElementById("dz").value = nums[2].replace(',', '.');
        draw();
        speak("Đã cập nhật dữ liệu");
    } else {
        speak("Chưa nhận diện đủ 3 thông số dài rộng cao");
    }
}

/* ĐỌC PHẢN HỒI */
function speak(t) {
    let u = new SpeechSynthesisUtterance(t);
    u.lang = "vi-VN";
    speechSynthesis.speak(u);
}

/* XUẤT FILE Opening.mac ĐÚNG CẤU TRÚC AVEVA */
function saveFile() {
    let px = +document.getElementById("px").value || 0;
    let py = +document.getElementById("py").value || 0;
    let pz = +document.getElementById("pz").value || 0;

    let L = +document.getElementById("dx").value || 0;
    let W = +document.getElementById("dy").value || 0;
    let H = +document.getElementById("dz").value || 0;

    let r1 = document.getElementById("r1").value || 0;
    let r2 = document.getElementById("r2").value || 0;
    let r3 = document.getElementById("r3").value || 0;
    let r4 = document.getElementById("r4").value || 0;

    let data = `NEW EQUIPMENT
USRCOG ( X ( 0 ) Y ( 0 ) Z ( 0 ) )
USRWCO ( X ( 0 ) Y ( 0 ) Z ( 0 ) )
POS X ${px}mm Y ${py}mm Z ${pz}mm
ORI Y is -X and Z is Y
BUIL false
DSCO unset
PTSP unset
INSC unset

NEW EXTRUSION
ORI Y is -Y and Z is Z
LEVE 0 2
HEIG ${H}mm

NEW LOOP

NEW VERTEX
FRAD ${r1}mm

END
NEW VERTEX
POS X 0mm Y ${W}mm Z 0mm
FRAD ${r2}mm

END
NEW VERTEX
POS X ${L}mm Y ${W}mm Z 0mm
FRAD ${r3}mm

END
NEW VERTEX
POS X ${L}mm Y 0mm Z 0mm
FRAD ${r4}mm

END
END
END
END`;

    let blob = new Blob([data], { type: "text/plain" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Opening.mac";
    a.click();
}

/* RESET FORM VỀ MẶC ĐỊNH */
function reset() {
    document.getElementById("px").value = 0;
    document.getElementById("py").value = 0;
    document.getElementById("pz").value = 0;
    document.getElementById("dx").value = 0;
    document.getElementById("dy").value = 0;
    document.getElementById("dz").value = 0;
    document.getElementById("r1").value = 150;
    document.getElementById("r2").value = 150;
    document.getElementById("r3").value = 150;
    document.getElementById("r4").value = 150;
    setOri('Z');
}

/* HELP LINK */
function help() {
    window.open("https://drive.google.com/file/d/14NNDzXSCG63m1yQZb51tZhrZfd5k8KPf/view?usp=sharing");
}

/* EVENT LISTENERS TỰ ĐỘNG CẬP NHẬT CANVAS */
document.querySelectorAll("input").forEach(i => {
    i.addEventListener("input", draw);
});

window.addEventListener("resize", draw);
draw();
