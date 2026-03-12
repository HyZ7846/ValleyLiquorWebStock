let db;

    // Initialize SQL.js
    async function initDatabase() {
        const SQL = await initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}` });
        
        // Check if we have a saved database in localStorage
        const savedDb = localStorage.getItem("liquor_db");
        if (savedDb) {
            const u8 = new Uint8Array(JSON.parse(savedDb));
            db = new SQL.Database(u8);
        } else {
            db = new SQL.Database();
            // Create Table using Pure SQL
            db.run("CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, name TEXT, section TEXT, quantity INTEGER, image TEXT);");
        }
        renderAll();
    }

    function persist() {
        const data = db.export();
        const array = Array.from(data);
        localStorage.setItem("liquor_db", JSON.stringify(array));
    }

    window.saveProduct = async function() {
        const type = $('#productType').val();
        const name = $('#productName').val();
        const section = $('#productSection').val();
        const quantity = $('#productQuantity').val();
        const imageInput = document.getElementById('productImage');
        const file = imageInput.files[0];
        
        const MAX_SIZE = 64 * 1024 * 1024; // 64MB
        const defaultImgPath = "./Resources/defaultLiquorImg.png"; 
    
        // Helper to convert image to Base64
        const toBase64 = file => new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => resolve(null); // Return null on error instead of rejecting
        });
    
        // Helper to fetch local default image and convert to Base64
        const getDefaultBase64 = async (path) => {
            try {
                const response = await fetch(path);
                const blob = await response.blob();
                return await toBase64(blob);
            } catch (e) {
                return ""; // Final fallback if even the default file is missing
            }
        };
    
        let imageData = null;
    
        // Try to process the user's file first
        if (file && file.size <= MAX_SIZE) {
            imageData = await toBase64(file);
        }
    
        // If user file failed, was too big, or didn't exist, use default
        if (!imageData) {
            imageData = await getDefaultBase64(defaultImgPath);
        }
    
        // PURE SQL INSERT - This will always run now
        try {
            db.run("INSERT INTO products (type, name, section, quantity, image) VALUES (?, ?, ?, ?, ?)", 
                   [type, name, section, Number(quantity) || 0, imageData]);
            
            persist();
            $('#addProductModal').modal('hide');
            renderAll();
            document.getElementById('addProductForm').reset();
        } catch (dbError) {
            console.error("Database error:", dbError);
        }
    };

    window.toggleRotation = function() {
        const img = document.getElementById('navBtnImg');
        const menu = document.getElementById('sideMenu');
        const overlay = document.getElementById('menuOverlay');
    
        // 1. Rotate the image
        img.classList.toggle('rotate-90');
    
        // 2. Slide the menu
        menu.classList.toggle('active');
    
        // 3. Toggle Overlay visibility
        if (menu.classList.contains('active')) {
            overlay.style.display = 'block';
        } else {
            overlay.style.display = 'none';
        }
    }

    function renderAll() {
        const sections = ['coolers-section', 'sleeman-section', 'bigrock-section'];
        
        sections.forEach(sec => {
            // PURE SQL SELECT
            const res = db.exec("SELECT * FROM products WHERE section = '" + sec + "'");
            
            // This converts 'coolers-section' to 'coolers-products'
            const containerId = sec.replace('-section', '-products');
            const container = document.getElementById(containerId);
            
            if (!container) {
                console.error("Could not find container:", containerId);
                return;
            }
    
            let html = '<div class="row">';
            if (res.length > 0) {
                res[0].values.forEach(row => {
                    html += `
                        <div class="col-6 col-md-4 col-lg-2">
                            <div class="product-item">
                                <button class="delete-btn" onclick="deleteItem(${row[0]})">&times;</button>
                                <img src="${row[5]}">
                                <b>${row[1]}</b>
                                <div>${row[2]}</div>
                                <h4 id="qty-${row[0]}">${row[4]}</h4>
                                <input type="number" id="in-${row[0]}" class="form-control mb-1" style="width:60px">
                                <button class="btn btn-sm btn-success" onclick="updateQty(${row[0]})">OK</button>
                            </div>
                        </div>`;
                });
            }
            html += '</div>';
            container.innerHTML = html;
        });
    }

    window.updateQty = function(id) {
        const newQty = $(`#in-${id}`).val();
        // PURE SQL UPDATE
        db.run("UPDATE products SET quantity = ? WHERE id = ?", [newQty, id]);
        persist();
        renderAll();
    };

    window.deleteItem = function(id) {
        // PURE SQL DELETE
        db.run("DELETE FROM products WHERE id = ?", [id]);
        persist();
        renderAll();
    };

    window.showAddProductModal = () => $('#addProductModal').modal('show');

    document.addEventListener('DOMContentLoaded', () => {
        initDatabase();
    });