const palabras = ["CORRER", "JUGAR", "COMER", "CAMINAR", "NADAR", "ESCUCHAR", "HABLAR", "TOCAR", "BAILAR", "LEER"];
        let palabrasEncontradas = new Set();
        let seleccion = [];

        function generarSopaLetras() {
            const sopa = Array.from({ length: 10 }, () => Array(10).fill(''));
            palabras.forEach((palabra) => {
                let colocada = false;
                let intentos = 0;
                while (!colocada && intentos < 100) {
                    const direccion = Math.random() > 0.5 ? "horizontal" : "vertical";
                    const fila = Math.floor(Math.random() * 10);
                    const columna = Math.floor(Math.random() * 10); 
                    if (puedeColocarPalabra(sopa, palabra, fila, columna, direccion)) {
                        colocarPalabra(sopa, palabra, fila, columna, direccion);
                        colocada = true;
                    }
                    intentos++;
                }
                if (!colocada) console.error('No se pudo colocar la palabra: ${palabra}');
            });

            for (let i = 0; i < 10; i++) { 
                for (let j = 0; j < 10; j++) { 
                    if (sopa[i][j] === '') {
                        sopa[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                    }
                }
            }
            return sopa;
        }

        function puedeColocarPalabra(sopa, palabra, fila, columna, direccion) {
            if (direccion === "horizontal" && columna + palabra.length > 10) return false;
            if (direccion === "vertical" && fila + palabra.length > 10) return false;

            for (let i = 0; i < palabra.length; i++) {
                const actual = direccion === "horizontal" ? sopa[fila][columna + i] : sopa[fila + i][columna];
                if (actual !== '' && actual !== palabra[i]) return false;
            }
            return true;
        }

        function colocarPalabra(sopa, palabra, fila, columna, direccion) {
            for (let i = 0; i < palabra.length; i++) {
                if (direccion === "horizontal") sopa[fila][columna + i] = palabra[i];
                else sopa[fila + i][columna] = palabra[i];
            }
        }

        const sopaLetrasDiv = document.getElementById("sopa-letras");
        const listaPalabrasUl = document.getElementById("lista-palabras");
        const reiniciarBtn = document.getElementById("reiniciar-btn");
        const salirBtn = document.getElementById("salir-btn");

        function renderizarSopa() {
            sopaLetrasDiv.innerHTML = "";
            listaPalabrasUl.innerHTML = "";
            palabrasEncontradas.clear();
            seleccion = [];

            const sopa = generarSopaLetras();
            sopa.forEach((fila, i) => {
                fila.forEach((letra, j) => {
                    const celda = document.createElement("div");
                    celda.textContent = letra;
                    celda.dataset.fila = i;
                    celda.dataset.columna = j;
                    celda.addEventListener("click", seleccionarLetra);
                    sopaLetrasDiv.appendChild(celda);
                });
            });

            palabras.forEach((palabra) => {
                const palabraLi = document.createElement("li");
                palabraLi.textContent = palabra;
                listaPalabrasUl.appendChild(palabraLi);
            });
        }

        function seleccionarLetra(e) {
            const celda = e.target;
            seleccion.push(celda);
            celda.classList.add("seleccionado");

            const palabraSeleccionada = seleccion.map(c => c.textContent).join("");

            const esPosible = palabras.some(palabra => palabra.startsWith(palabraSeleccionada));

            if (!esPosible) {
                seleccion.forEach(c => c.classList.remove("seleccionado"));
                seleccion = [];
            } else if (palabras.includes(palabraSeleccionada)) {
                palabrasEncontradas.add(palabraSeleccionada);

                document.querySelectorAll("#lista-palabras li").forEach((li) => {
                    if (li.textContent === palabraSeleccionada) {
                        li.remove();
                    }
                });

                seleccion.forEach(c => c.classList.add("encontrada"));
                seleccion = [];

                if (palabrasEncontradas.size === palabras.length) {
                    setTimeout(() => alert("¡Felicitaciones!, has encontrado todas las palabras."), 100);
                }
            }
        }

        const sonidoSalir = new Audio("sonido.mp3");
        const sonidoReiniciar = new Audio("seleccion.mp3");

        reiniciarBtn.addEventListener("click", () => {
            sonidoReiniciar.play();  
            renderizarSopa();
        });

        salirBtn.addEventListener("click", () => {
            const confirmarSalir = window.confirm("¿Estás seguro de que quieres salir?");
            if (confirmarSalir) {
                sonidoSalir.play(); 
                window.location.href = "index.html"; 
            }
        });

        renderizarSopa();