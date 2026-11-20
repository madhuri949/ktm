/* =====================================================
   KTM 390 ADVENTURE
   VUE.JS APPLICATION
===================================================== */

const {
    createApp
} = Vue;


createApp({

    data() {

        return {

            /* ===============================
               LOADER
            =============================== */

            loaded: false,

            loadingProgress: 0,


            /* ===============================
               NAVIGATION
            =============================== */

            scrollY: 0,

            mobileMenu: false,


            /* ===============================
               BIKE IMAGE
            =============================== */

            /*
              Replace this URL with your own
              official KTM image if required.
            */

            bikeImage:
                "ktm-390.svg",


            /* ===============================
               3D ROTATION
            =============================== */

            mouseX: 0,

            mouseY: 0,


            /* ===============================
               ANIMATED STATS
            =============================== */

            animatedPower: 0,

            animatedTorque: 0,


            /* ===============================
               TECHNOLOGY
            =============================== */

            selectedTech: 0,

            animationPlaying: false,

            exportingVideo: false,

            videoExportMessage: "",

            technologies: [

                {

                    title:
                        "QUICKSHIFTER+",

                    icon:
                        "⚡",

                    description:
                        "Quickshifter+ enables fast and smooth clutchless gear changes, helping maintain momentum during acceleration and changing terrain."

                },

                {

                    title:
                        "5-INCH TFT",

                    icon:
                        "▣",

                    description:
                        "The full-colour TFT display presents essential riding information with a modern interface and intuitive handlebar controls."

                },

                {

                    title:
                        "CORNERING ABS",

                    icon:
                        "◉",

                    description:
                        "Advanced braking assistance helps maintain control while braking during cornering and changing road conditions."

                },

                {

                    title:
                        "RIDE-BY-WIRE",

                    icon:
                        "↯",

                    description:
                        "Electronic throttle control provides precise and predictable power delivery across different riding conditions."

                },

                {

                    title:
                        "CRUISE CONTROL",

                    icon:
                        "→",

                    description:
                        "Cruise control is designed to reduce rider fatigue during long highway and touring sections."

                }

            ],


            /* ===============================
               RIDE MODES
            =============================== */

            selectedMode:
                "STREET",

            rideModes: [

                {

                    name:
                        "STREET",

                    number:
                        "01",

                    description:
                        "Balanced performance for everyday roads, commuting and highway riding."

                },

                {

                    name:
                        "RAIN",

                    number:
                        "02",

                    description:
                        "Designed to provide smoother throttle response and confidence when roads become wet."

                },

                {

                    name:
                        "OFF-ROAD",

                    number:
                        "03",

                    description:
                        "Adventure-focused control for loose surfaces, trails and challenging terrain."

                }

            ],


            /* ===============================
               EMI
            =============================== */

            bikePrice:
                394699,

            downPayment:
                100000,

            interestRate:
                9.49,

            tenure:
                48,


            /* ===============================
               TEST RIDE
            =============================== */

            testRideOpen:
                false,

            submitted:
                false,

            submissionError:
                "",

            form: {

                name:
                    "",

                phone:
                    "",

                city:
                    ""

            }

        };

    },


    computed: {


        /* ===============================
           3D BIKE TRANSFORM
        =============================== */

        bikeTransform() {

            return {

                transform:
                    `rotateY(${this.mouseX}deg)
                     rotateX(${this.mouseY}deg)
                     translateZ(80px)`

            };

        },


        /* ===============================
           RIDE MODE DATA
        =============================== */

        selectedModeData() {

            return this.rideModes.find(
                mode =>
                    mode.name === this.selectedMode
            );

        },


        /* ===============================
           EMI
        =============================== */

        emi() {

            const principal =
                Math.max(
                    0,
                    this.bikePrice -
                    this.downPayment
                );

            const monthlyRate =
                this.interestRate /
                12 /
                100;

            const months =
                this.tenure;


            if (
                principal <= 0
            ) {

                return 0;

            }


            if (
                monthlyRate === 0
            ) {

                return principal / months;

            }


            const result =
                principal *
                monthlyRate *
                Math.pow(
                    1 + monthlyRate,
                    months
                ) /
                (
                    Math.pow(
                        1 + monthlyRate,
                        months
                    ) - 1
                );


            return Math.round(result);

        }

    },


    methods: {


        /* ===============================
           LOADING
        =============================== */

        startLoader() {

            let progress = 0;

            const interval =
                setInterval(() => {

                    progress +=
                        Math.random() * 12;

                    if (
                        progress >= 100
                    ) {

                        progress = 100;

                        clearInterval(interval);

                        setTimeout(() => {

                            this.loaded = true;

                        }, 500);

                    }

                    this.loadingProgress =
                        Math.floor(progress);

                }, 100);

        },


        /* ===============================
           SCROLL
        =============================== */

        updateScroll() {

            this.scrollY =
                window.scrollY;

        },


        scrollToSection(id) {

            const element =
                document.getElementById(id);

            if (!element) return;

            element.scrollIntoView({

                behavior:
                    "smooth"

            });

        },


        /* ===============================
           MOUSE 3D
        =============================== */

        handleMouseMove(event) {

            const rect =
                event.currentTarget.getBoundingClientRect();


            const x =
                event.clientX -
                rect.left;


            const y =
                event.clientY -
                rect.top;


            const centerX =
                rect.width / 2;


            const centerY =
                rect.height / 2;


            this.mouseX =
                ((x - centerX) /
                    centerX) *
                12;


            this.mouseY =
                -(
                    (y - centerY) /
                    centerY
                ) *
                8;

        },


        resetTilt() {

            this.mouseX = 0;

            this.mouseY = 0;

        },


        toggleAnimation() {

            this.animationPlaying = !this.animationPlaying;

        },


        async exportRevealVideo() {

            if (this.exportingVideo) return;

            if (!window.MediaRecorder) {

                this.videoExportMessage = "Video export is not supported in this browser.";

                return;

            }

            this.exportingVideo = true;
            this.videoExportMessage = "Preparing cinematic render...";

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            const image = new Image();
            const chunks = [];
            const width = 1280;
            const height = 720;
            const duration = 6000;
            const started = performance.now();

            canvas.width = width;
            canvas.height = height;

            image.src = this.bikeImage;

            try {

                await image.decode();

                const stream = canvas.captureStream(30);
                const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

                recorder.ondataavailable = event => {

                    if (event.data.size) chunks.push(event.data);

                };

                const finished = new Promise(resolve => {

                    recorder.onstop = resolve;

                });

                recorder.start();

                const renderFrame = now => {

                    const progress = Math.min((now - started) / duration, 1);
                    const eased = progress < .5
                        ? 2 * progress * progress
                        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                    const scale = .72 + Math.sin(eased * Math.PI) * .22;
                    const rotation = -0.12 + eased * .24;
                    const x = width / 2 + (eased - .5) * 170;
                    const y = height / 2 + Math.sin(eased * Math.PI) * -18;

                    context.fillStyle = "#050505";
                    context.fillRect(0, 0, width, height);

                    const glow = context.createRadialGradient(x, y + 100, 20, x, y + 100, 420);
                    glow.addColorStop(0, "rgba(255,101,0,.22)");
                    glow.addColorStop(1, "rgba(255,101,0,0)");
                    context.fillStyle = glow;
                    context.fillRect(0, 0, width, height);

                    context.save();
                    context.translate(x, y);
                    context.rotate(rotation);
                    context.scale(scale, scale);
                    context.globalAlpha = Math.min(1, progress * 5);
                    context.drawImage(image, -image.width / 2, -image.height / 2);
                    context.restore();

                    context.fillStyle = "rgba(255,255,255,.16)";
                    context.fillRect(128, height - 68, width - 256, 2);
                    context.fillStyle = "#ff6500";
                    context.fillRect(128, height - 68, (width - 256) * progress, 2);

                    if (progress < 1) {
                        requestAnimationFrame(renderFrame);
                    } else {
                        recorder.stop();
                    }

                };

                requestAnimationFrame(renderFrame);
                await finished;

                const blob = new Blob(chunks, { type: "video/webm" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");

                link.href = url;
                link.download = "ktm-390-cinematic-reveal.webm";
                link.click();
                URL.revokeObjectURL(url);

                this.videoExportMessage = "Video downloaded.";

            } catch (error) {

                this.videoExportMessage = "Video export failed. Try Chrome or Edge.";

            } finally {

                this.exportingVideo = false;

            }

        },


        /* ===============================
           NUMBER ANIMATION
        =============================== */

        animateValue(property, target, duration = 1200) {

            const start = performance.now();

            const update = (now) => {

                const progress = Math.min(
                    (now - start) / duration,
                    1
                );

                this[property] = Number(
                    (target * progress).toFixed(1)
                );

                if (progress < 1) {

                    requestAnimationFrame(update);

                }

            };

            requestAnimationFrame(update);

        },


        animatePower() {

            this.animateValue(
                "animatedPower",
                41.5
            );

        },


        animateTorque() {

            this.animateValue(
                "animatedTorque",
                33.5
            );

        },


        /* ===============================
           PARTICLES
        =============================== */

        particleStyle(index) {

            const left =
                Math.random() * 100;

            const duration =
                5 +
                Math.random() * 10;

            const move =
                (
                    Math.random() * 200
                ) - 100;


            return {

                left:
                    `${left}%`,

                "--duration":
                    `${duration}s`,

                "--move":
                    `${move}px`,

                animationDelay:
                    `${Math.random() * 8}s`

            };

        },


        /* ===============================
           NUMBER FORMAT
        =============================== */

        formatNumber(number) {

            return new Intl.NumberFormat(
                "en-IN"
            ).format(
                Math.round(number)
            );

        },


        /* ===============================
           TEST RIDE
        =============================== */

        openTestRide() {

            this.testRideOpen = true;

            this.submitted = false;

            this.submissionError = "";

            document.body.style.overflow =
                "hidden";

        },


        closeTestRide() {

            this.testRideOpen = false;

            document.body.style.overflow =
                "";

        },


        async submitTestRide() {

            this.submissionError = "";

            try {

                const response = await fetch(
                    "/api/test-rides",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify(this.form)
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || "Unable to submit request.");
                }

                this.submitted = true;

            } catch (error) {

                this.submissionError =
                    "Could not submit your request. Please try again.";

                return;

            }

            setTimeout(() => {

                this.form = {

                    name:
                        "",

                    phone:
                        "",

                    city:
                        ""

                };

                this.closeTestRide();

            }, 1800);

        }

    },


    mounted() {

        /* Loader */

        this.startLoader();


        /* Scroll */

        window.addEventListener(
            "scroll",
            this.updateScroll
        );


        /* Number animation */

        setTimeout(() => {

            this.animatePower();

            this.animateTorque();

        }, 1500);

    },


    beforeUnmount() {

        window.removeEventListener(
            "scroll",
            this.updateScroll
        );

    }

}).mount("#app");