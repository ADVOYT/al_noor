// أماكن ثابتة مرتبة لـ 10 ثمرات داخل تاج الشجرة
const fixedSpots = [
    { left: '50%', top: '15%' }, // القمة
    { left: '40%', top: '25%' }, { left: '60%', top: '25%' },
    { left: '32%', top: '35%' }, { left: '50%', top: '35%' }, { left: '68%', top: '35%' },
    { left: '38%', top: '48%' }, { left: '50%', top: '50%' }, { left: '62%', top: '48%' },
    { left: '50%', top: '25%' }  // ثمرة إضافية في الوسط العلوي
];

let trees = JSON.parse(localStorage.getItem("trees")) || [];

function save() {
    localStorage.setItem("trees", JSON.stringify(trees));
}

function addTreeFromInput() {
    const input = document.getElementById("studentNameInput");
    const name = input.value.trim();
    if (!name) return alert("الرجاء إدخال اسم الطالبة");
    
    trees.push({ id: Date.now(), name: name, fruits: [] });
    input.value = "";
    save();
    renderTrees();
}

function addFruit(treeId, emoji) {
    const tree = trees.find(t => t.id === treeId);
    
    // التحقق من الحد الأقصى (10 ثمرات)
    if (tree.fruits.length >= 10) {
        showSuccessMessage(tree.name);
        return;
    }

    // اختيار موقع ثابت بناءً على عدد الثمار الحالي
    const spot = fixedSpots[tree.fruits.length];
    
    tree.fruits.push({
        id: Date.now(),
        emoji: emoji,
        left: spot.left,
        top: spot.top
    });

    save();
    renderTrees();

    // إذا كانت هذه هي الثمرة العاشرة، نظهر الرسالة فوراً
    if (tree.fruits.length === 10) {
        setTimeout(() => showSuccessMessage(tree.name), 600);
    }
}

// دالة إظهار رسالة الإنجاز
function showSuccessMessage(name) {
    const msg = document.createElement("div");
    msg.className = "success-overlay";
    msg.innerHTML = `
        <div class="success-card">
            <span class="text-6xl">🎉</span>
            <h2 class="text-2xl font-bold mt-4">هنيئاً لكِ الإنجاز يا ${name}</h2>
            <p class="mt-2 opacity-90">لقد ملأتِ شجرتكِ بالثمار الطيبة 🌟</p>
            <button onclick="this.parentElement.parentElement.remove()" class="mt-6 bg-white text-[#94A378] px-6 py-2 rounded-full font-bold shadow-lg">استمرار</button>
        </div>
    `;
    document.body.appendChild(msg);
}

function removeFruit(treeId) {
    const tree = trees.find(t => t.id === treeId);
    tree.fruits.pop();
    save();
    renderTrees();
}

function deleteTree(id) {
    if(confirm("هل تريد حذف الشجرة؟")) {
        trees = trees.filter(t => t.id !== id);
        save();
        renderTrees();
    }
}

function renderTrees() {
    const container = document.getElementById("treesContainer");
    if (!container) return;

    container.innerHTML = trees.map(t => `
        <div class="tree-card bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100 relative overflow-hidden flex flex-col items-center">
            <button onclick="deleteTree(${t.id})" class="absolute top-5 left-5 text-gray-300 hover:text-red-500 z-20">🗑️</button>
            <h3 class="text-2xl font-bold text-[#2D3C59] mb-4">${t.name}</h3>
            
            <div class="tree-visual relative w-full h-80 flex items-center justify-center bg-gradient-to-b from-[#f8fafc] to-white rounded-3xl mb-6 overflow-hidden">
                <span class="tree-emoji text-[200px] leading-none select-none z-0">🌳</span>
                <div class="absolute bottom-2 right-2 text-xs text-gray-400 font-bold">${t.fruits.length}/10</div>
                
                ${t.fruits.map(f => `
                    <div class="absolute text-4xl fruit-soft-appear z-10" 
                         style="left:${f.left}; top:${f.top}; transform: translate(-50%, -50%);">
                        ${f.emoji}
                    </div>
                `).join("")}
            </div>

            <div class="grid grid-cols-5 gap-2 mb-4">
                ${['🍎', '🍏', '🍊', '🍓', '🍇'].map(e => `
                    <button onclick="addFruit(${t.id}, '${e}')" 
                            class="bg-white hover:bg-green-50 w-11 h-11 rounded-full shadow-sm text-2xl flex items-center justify-center border border-gray-100 transform active:scale-90 transition">
                        ${e}
                    </button>
                `).join("")}
            </div>

            <button onclick="removeFruit(${t.id})" class="text-[10px] text-gray-300 hover:text-red-300 transition uppercase">تراجع عن آخر ثمرة</button>
        </div>
    `).join("");
}

window.onload = renderTrees;