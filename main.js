// Variabili globali
    var camera, scene, renderer, mouse, raycaster;
    var dodecaedri = [];

    init();
    animate();

    function init() {
      // Creazione della scena
      scene = new THREE.Scene();

      // Creazione della camera
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      // Creazione del renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0xffffff);

      // Aggiunta del renderer al DOM
      var heroSection = document.querySelector('.hero');
      heroSection.appendChild(renderer.domElement);

      // Creazione dei dodecaedri
      for (var i = 0; i < 10; i++) {
        var geometry = new THREE.DodecahedronGeometry(1);
        var material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
        var dodecaedro = new THREE.Mesh(geometry, material);
        dodecaedro.position.set(Math.random() * 6 - 3, Math.random() * 6 - 3, Math.random() * 6 - 3);
        scene.add(dodecaedro);
        dodecaedri.push(dodecaedro);
      }

      // Event listener per il movimento del mouse
      mouse = new THREE.Vector2();
      raycaster = new THREE.Raycaster();
      document.addEventListener('mousemove', onMouseMove, false);

      // Event listener per la ridimensione della finestra
      window.addEventListener('resize', onWindowResize, false);
    }

    function animate() {
      requestAnimationFrame(animate);

      // Movimento dei dodecaedri
      var time = Date.now() * 0.0005;
      for (var i = 0; i < dodecaedri.length; i++) {
        var dodecaedro = dodecaedri[i];
        dodecaedro.position.x = Math.sin(time * (i + 1)) * 2;
        dodecaedro.position.y = Math.cos(time * (i + 2)) * 2;
        dodecaedro.position.z = Math.sin(time * (i + 3)) * 2;
      }

      // Rendering della scena
      renderer.render(scene, camera);
    }

    function onMouseMove(event) {
      // Aggiornamento della posizione del mouse
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Calcolo dell'intersezione con il mouse
      raycaster.setFromCamera(mouse, camera);
      var intersects = raycaster.intersectObjects(dodecaedri);

      // Allontanamento dei dodecaedri se il mouse è vicino
      if (intersects.length > 0) {
        for (var i = 0; i < intersects.length; i++) {
          var dodecaedro = intersects[i].object;
          var distance = intersects[i].distance;
          var scale = 1 + distance * 0.1;
          dodecaedro.scale.set(scale, scale, scale);
        }
      } else {
        // Reset dello scale dei dodecaedri
        for (var i = 0; i < dodecaedri.length; i++) {
          var dodecaedro = dodecaedri[i];
          dodecaedro.scale.set(1, 1, 1);
        }
      }
    }

    function onWindowResize() {
      // Aggiornamento delle dimensioni della finestra
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }