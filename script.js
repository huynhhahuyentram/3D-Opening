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

/* HÀM VẼ TỔNG HỢP REAL-TIME HÌNH 3D BO GÓC */
function draw() {
    c.width = c.offsetWidth;
    c.height = 280;

    let L = +document.getElementById("dx").value || 0;
    let W = +document.getElementById("dy").value || 0;
    let H = +document.getElementById("dz").value || 0;

    let r1 = +document.getElementById("r1").value || 0;
    let r2 = +document.getElementById("r2").value || 0;
    let r3 = +document.getElementById("r3").value || 0;
    let r4 = +document.getElementById("r4").value || 0;

    ctx.clearRect(0, 0, c.width, c.height);

    drawAxis();

    if (L === 0 && W === 0 && H === 0) return;

    let maxDim = Math.max(L, W, H, 100);
    let scale = 110 / maxDim;

    let l = L * scale;
    let w = W * scale;
    let h = H * scale;

    let R1 = Math.min(r1 * scale, l / 2, w / 2);
    let R2 = Math.min(r2 * scale, l / 2, w / 2);
    let R3 = Math.min(r3 * scale, l / 2, w / 2);
    let R4 = Math.min(r4 * scale, l / 2, w / 2);

    let cx = c.width / 2;
    let cy = c.height / 2 + 10;

    if (ORI === "Z") {
        drawRoundedBox(cx, cy, l, w, h, R1, R2, R3, R4, "L = " + L, "W = " + W, "H = " + H);
    } else if (ORI === "X") {
        drawRoundedBox(cx, cy, w, h, l, R1, R2, R3, R4, "W = " + W, "H = " + H, "L = " + L);
    } else if (ORI === "Y") {
        drawRoundedBox(cx, cy, l, h, w, R1, R2, R3, R4, "L = " + L, "H = " + H, "W = " + W);
    }
}

/* TRỤC TỌA ĐỘ BÀN TAY PHẢI */
function drawAxis() {
    ctx.lineWidth = 2.5;
    ctx.font = "bold 14px Segoe UI";

    let x0 = 50, y0 = 220;

    // Trục X (Đỏ)
    ctx.strokeStyle = "#e74c3c";
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + 50, y0);
    ctx.stroke();
    ctx.fillText("X", x0 + 55, y0 + 5);

    // Trục Y (Xanh nước biển)
    ctx.strokeStyle = "#2980b9";
    ctx.fillStyle = "#2980b9";
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + 35, y0 - 30);
    ctx.stroke();
    ctx.fillText("Y", x0 + 40, y0 - 32);

    // Trục Z (Xanh lá cây)
    ctx.strokeStyle = "#27ae60";
    ctx.fillStyle = "#27ae60";
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0, y0 - 50);
    ctx.stroke();
    ctx.fillText("Z", x0 - 5, y0 - 55);
}

/* BIẾN ĐỔI ISO */
function isoProj(x, y, z, cx, cy) {
    let cos30 = 0.866;
    let sin30 = 0.5;
    return {
        x: cx + (x - y) * cos30,
        y: cy + (x + y) * sin30 - z
    };
}

/* TẠO ĐƯỜNG DẪN MẶT ĐÁY VỚI 4 GÓC BO CORNER RADIUS */
function buildRoundedPath(ctx, d1, d2, zLevel, cx, cy, r1, r2, r3, r4) {
    let p0 = isoProj(0, 0, zLevel, cx, cy);
    let p1 = isoProj(d1, 0, zLevel, cx, cy);
    let p2 = isoProj(d1, d2, zLevel, cx, cy);
    let p3 = isoProj(0, d2, zLevel, cx, cy);

    ctx.beginPath();
    
    // Góc R1 (0,0)
    let p0_a = isoProj(r1, 0, zLevel, cx, cy);
    let p0_b = isoProj(0, r1, zLevel, cx, cy);
    ctx.moveTo(p0_a.x, p0_a.y);

    // Đến Góc R2 (d1,0)
    let p1_a = isoProj(d1 - r2, 0, zLevel, cx, cy);
    let p1_b = isoProj(d1, r2, zLevel, cx, cy);
    ctx.lineTo(p1_a.x, p1_a.y);
    ctx.quadraticCurveTo(p1.x, p1.y, p1_b.x, p1_b.y);

    // Đến Góc R3 (d1,d2)
    let p2_a = isoProj(d1, d2 - r3, zLevel, cx, cy);
    let p2_b = isoProj(d1 - r3, d2, zLevel, cx, cy);
    ctx.lineTo(p2_a.x, p2_a.y);
    ctx.quadraticCurveTo(p2.x, p2.y, p2_b.x, p2_b.y);

    // Đến Góc R4 (0,d2)
    let p3_a = isoProj(r4, d2, zLevel, cx, cy);
    let p3_b = isoProj(0, d2 - r4, zLevel, cx, cy);
    ctx.lineTo(p3_a.x, p3_a.y);
    ctx.quadraticCurveTo(p3.x, p3.y, p3_b.x, p3_b.y);

    // Về Góc R1
    ctx.lineTo(p0_b.x, p0_b.y);
    ctx.quadraticCurveTo(p0.x, p0.y, p0_a.x, p0_a.y);
    ctx.closePath();
}

/* VẼ KHỐI 3D CHÂN THỰC VỚI BO GÓC */
function drawRoundedBox(cx, cy, d1, d2, d3, r1, r2, r3, r4, label1, label2, label3) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1e293b";
    ctx.fillStyle = "rgba(45, 137, 239, 0.15)";

    // Vẽ & Tô bóng mặt dưới
    buildRoundedPath(ctx, d1, d2, 0, cx - d1/3, cy - 20, r1, r2, r3, r4);
    ctx.stroke();

    // Vẽ các đường dựng đứng 4 góc bo
    let ptsBottom = [
        isoProj(r1, 0, 0, cx - d1/3, cy - 20),
        isoProj(d1 - r2, 0, 0, cx - d1/3, cy - 20),
        isoProj(d1, d2 - r3, 0, cx - d1/3, cy - 20),
        isoProj(r4, d2, 0, cx - d1/3, cy - 20)
    ];

    let ptsTop = [
        isoProj(r1, 0, d3, cx - d1/3, cy - 20),
        isoProj(d1 - r2, 0, d3, cx - d1/3, cy - 20),
        isoProj(d1, d2 - r3, d3, cx - d1/3, cy - 20),
        isoProj(r4, d2, d3, cx - d1/3, cy - 20)
    ];

    for(let i=0; i<4; i++) {
        ctx.beginPath();
        ctx.moveTo(ptsBottom[i].x, ptsBottom[i].y);
        ctx.lineTo(ptsTop[i].x, ptsTop[i].y);
        ctx.stroke();
    }

    // Vẽ & Tô bóng mặt trên
    buildRoundedPath(ctx, d1, d2, d3, cx - d1/3, cy - 20, r1, r2, r3, r4);
    ctx.fill();
    ctx.stroke();

    // Nhãn kích thước
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 13px Segoe UI";
    let centerBottom = isoProj(d1/2, 0, 0, cx - d1/3, cy - 20);
    let centerLeft = isoProj(0, d2/2, 0, cx - d1/3, cy - 20);
    let centerHeight = isoProj(0, 0, d3/2, cx - d1/3, cy - 20);

    ctx.fillText(label1, centerBottom.x - 15, centerBottom.y + 22);
    ctx.fillText(label2, centerLeft.x - 55, centerLeft.y + 15);
    ctx.fillText(label3, centerHeight.x - 60, centerHeight.y);
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
