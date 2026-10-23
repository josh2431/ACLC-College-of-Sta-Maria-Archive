(() => {
    const stageElements = Array.from(document.querySelectorAll("[data-stage]"));
    const screenStatus = document.querySelector("[data-screen-status]");
    const soundButton = document.querySelector("[data-sound-toggle]");
    let soundEnabled = false;
    let audioContext = null;

    const records = [
        {
            type: "CAMPUS PROFILE",
            title: "Sta. Maria campus node",
            copy: "ACLC College of Sta. Maria is part of the AMA Education System. This record identifies the campus archive. Check official school channels for current office, schedule, and enrollment information.",
            image: "assets/ama.png"
        },
        {
            type: "LEARNING IN PRACTICE",
            title: "A classroom project / sample record",       
            copy: "This archive entry highlights how students can apply classroom knowledge through projects, problem-solving activities, and practical learning experiences. It is a demonstration entry and does not feature actual student work.",
            image: "assets/classroom.jpg"
        },
        {
            type: "CAMPUS LIFE",
            title: "Activities and events / sample record",
            copy: "This entry represents a space for documenting campus activities, student participation, and school event highlights. It is a placeholder only and does not refer to a confirmed event, schedule, or official announcement.",
            image: "assets/acq.jpg"
        },
        {
            type: "TEACHER APPRECIATION",
            title: "A note for the people who teach",
            copy: "Educators play an important role in shaping students' knowledge, skills, and confidence. This message recognizes their dedication, patience, and continued support in guiding learners toward their academic goals. It is sample content, not an actual student submission",
            image: "assets/teach.jpg"
        }
    ];

    function showStage(name) {
        stageElements.forEach((stage) => {
            stage.hidden = stage.dataset.stage !== name;
        });
        if (screenStatus) {
            screenStatus.textContent = "";
        }
    }

    function playTone(frequency = 560) {
        if (!soundEnabled || !audioContext || audioContext.state !== "running") {
            return;
        }
        const oscillator = audioContext.createOscillator();
        const volume = audioContext.createGain();
        const now = audioContext.currentTime;
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, now);
        volume.gain.setValueAtTime(0.045, now);
        volume.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        oscillator.connect(volume);
        volume.connect(audioContext.destination);
        oscillator.start(now);
        oscillator.stop(now + 0.12);
    }

    function setSoundEnabled(enabled) {
        soundEnabled = enabled;
        if (soundButton) {
            soundButton.setAttribute("aria-pressed", String(enabled));
            soundButton.textContent = `SOUNSSD: ${enabled ? "ON" : "OFF"}`;
        }
    }

    soundButton?.addEventListener("click", () => {
        if (!soundEnabled) {
            const AudioContextConstructor = window.AudioContext;
            if (!AudioContextConstructor) {
                if (screenStatus) {
                    screenStatus.textContent = "Audio is not available in this browser.";
                }
                return;
            }
            audioContext ??= new AudioContextConstructor();
            audioContext.resume().then(() => {
                setSoundEnabled(true);
                playTone(660);
            }).catch(() => {
                setSoundEnabled(false);
                if (screenStatus) {
                    screenStatus.textContent = "Audio could not start. Sound remains off.";
                }
            });
            return;
        }
        setSoundEnabled(false);
    });

    const initializeButton = document.querySelector("[data-initialize]");
    const executeButton = document.querySelector("[data-execute-lock]");
    const marker = document.querySelector("[data-lock-marker]");
    const initialLockScanDuration = marker?.getAnimations().find((animation) =>
        animation.animationName === "lock-scan"
    )?.effect?.getTiming().duration;
    const gameStatus = document.querySelector("[data-game-status]");
    const segmentCount = document.querySelector("[data-segment-count]");
    const portalShell = document.querySelector(".portal-shell");
    let segmentsDecrypted = 0;
    let challengeComplete = false;

    function resetLockTarget() {
        const zone = document.querySelector(".lock-zone");
        zone?.style.removeProperty("width");
        zone?.style.removeProperty("left");
        if (marker) {
            marker.style.animationPlayState = "running";
            if (typeof initialLockScanDuration === "number") {
                setLockScanDuration(initialLockScanDuration);
            }
        }
        if (executeButton) {
            executeButton.disabled = false;
        }
    }

    function setLockScanDuration(nextDuration) {
        const lockScan = marker?.getAnimations().find((animation) =>
            animation.animationName === "lock-scan"
        );
        const effect = lockScan?.effect;
        const duration = effect?.getTiming().duration;
        const currentTime = lockScan?.currentTime;
        if (!effect || typeof duration !== "number") {
            return;
        }

        effect.updateTiming({ duration: nextDuration });
        if (typeof currentTime === "number") {
            lockScan.currentTime = currentTime * nextDuration / duration;
        }
    }

    function speedUpLockMarker() {
        if (!marker) {
            return;
        }
        const lockScan = marker.getAnimations().find((animation) =>
            animation.animationName === "lock-scan"
        );
        const effect = lockScan?.effect;
        const duration = effect?.getTiming().duration;
        if (!effect || typeof duration !== "number") {
            return;
        }

        const nextDuration = Math.max(600, duration * 0.75);
        setLockScanDuration(nextDuration);
    }

    function triggerMissFeedback() {
        if (portalShell) {
            portalShell.classList.remove("screen-shake");
            void portalShell.offsetWidth;
            portalShell.classList.add("screen-shake");
        }

        if (typeof navigator.vibrate === "function") {
            navigator.vibrate(200);
        }
    }

    function finishChallenge() {
        challengeComplete = true;
        if (marker) {
            marker.style.animationPlayState = "paused";
        }
        if (executeButton) {
            executeButton.disabled = true;
        }
        if (gameStatus) {
            gameStatus.textContent = "ALL SEGMENTS DECRYPTED. INITIALIZING CAMPUS NODE...";
        }
        playTone(840);
        window.setTimeout(() => {
            showStage("profile");
            document.querySelector("[data-open-archive]")?.focus();
        }, 700);
    }

    function shrinkAndMoveTarget(zone) {
        const container = zone.parentElement;
        if (!container) {
            return;
        }

        zone.style.width = `${Math.max(7, 20 * Math.pow(0.50, segmentsDecrypted))}%`;
        const maxPosition = Math.max(0, container.clientWidth - zone.offsetWidth);
        zone.style.left = `${Math.random() * maxPosition}px`;
    }

    initializeButton?.addEventListener("click", () => {
        resetLockTarget();
        segmentsDecrypted = 0;
        challengeComplete = false;
        if (segmentCount) {
            segmentCount.textContent = "0 / 3";
        }
        if (gameStatus) {
            gameStatus.textContent = "Awaiting input...";
        }
        showStage("decrypt");
        executeButton?.focus();
        playTone(440);
    });

    executeButton?.addEventListener("click", () => {
        if (!marker || challengeComplete) {
            return;
        }

        const markerBounds = marker.getBoundingClientRect();
        const zone = document.querySelector(".lock-zone");
        if (!zone) {
            return;
        }

        const zoneBounds = zone.getBoundingClientRect();
        const lockAccepted =
            markerBounds.left >= zoneBounds.left && markerBounds.right <= zoneBounds.right;

        if (!lockAccepted) {
            if (gameStatus) {
                gameStatus.textContent =
                    "LOCK MISSED. Try again when the marker reaches the blue zone.";
            }

            triggerMissFeedback();
            playTone(210);
            return;
        }

        segmentsDecrypted++;
        speedUpLockMarker();
        if (segmentCount) {
            segmentCount.textContent = `${segmentsDecrypted} / 3`;
        }
        if (segmentsDecrypted < 3) {
            shrinkAndMoveTarget(zone);
            if (gameStatus) {
                gameStatus.textContent =
                    `LOCK ACCEPTED. SEGMENT ${segmentsDecrypted} / 3 RECOVERED.`;
            }

            playTone(740 + segmentsDecrypted * 60);
            return;
        }

        if (gameStatus) {
            gameStatus.textContent = "ALL SEGMENTS DECRYPTED. INITIALIZING CAMPUS NODE...";
        }
        finishChallenge();
    });

    document.addEventListener("keydown", (event) => {
        const target = event.target;
        const isTyping = target instanceof HTMLElement &&
            (target.isContentEditable || target.closest("a, button, input, textarea, select"));
        const decryptStage = document.querySelector('[data-stage="decrypt"]');
        if (!isTyping && !decryptStage?.hidden && (event.code === "Space" || event.key === "Enter")) {
            event.preventDefault();
            executeButton?.click();
        }
    });

    document.querySelector("[data-open-archive]")?.addEventListener("click", () => {
        showStage("archive");
        document.querySelector("[data-decrypt-next]")?.focus();
        playTone(620);
    });

    const archiveButton = document.querySelector("[data-decrypt-next]");
    const previousRecordButton = document.querySelector("[data-previous-record]");
    const recordContainer = document.querySelector("[data-record]");
    const recoveredCount = document.querySelector("[data-files-recovered]");
    const archiveProgress = document.querySelector("[data-archive-progress]");
    const archiveStatus = document.querySelector("[data-archive-status]");
    const completePanel = document.querySelector("[data-archive-complete]");
    let recoveredRecords = 0;
    let currentRecordIndex = -1;

    function renderRecord(record, index) {
        if (!recordContainer) {
            return;
        }
        const metadata = document.createElement("div");
        metadata.className = "record-meta";
        const fileNumber = document.createElement("span");
        fileNumber.textContent = `FILE ${String(index + 1).padStart(2, "0")} / 04`;
        const type = document.createElement("span");
        type.textContent = record.type;
        metadata.append(fileNumber, type);

        const heading = document.createElement("h2");
        heading.className = "record-title";
        heading.textContent = record.title;
        const copy = document.createElement("p");
        copy.className = "record-copy";
        copy.textContent = record.copy;
        recordContainer.classList.add("has-record-image");
        recordContainer.style.setProperty(
            "--record-image",
            `url("${new URL(record.image, document.baseURI).href}")`
        );
        recordContainer.replaceChildren(metadata, heading, copy);

        if (record.link) {
            const link = document.createElement("a");
            link.className = "record-link";
            link.href = record.link.href;
            link.textContent = `${record.link.label} ↗`;
            recordContainer.append(link);
        }
    }

    function updateArchiveControls() {
        if (previousRecordButton) {
            previousRecordButton.disabled = currentRecordIndex <= 0;
        }
        if (archiveButton) {
            archiveButton.textContent =
                recoveredRecords === records.length && currentRecordIndex === records.length - 1
                    ? "[ COMPLETE ARCHIVE ]"
                    : "[ DECRYPT NEXT ]";
        }
    }

    function showRecoveredRecord(index) {
        currentRecordIndex = index;
        renderRecord(records[index], index);
        if (archiveStatus) {
            archiveStatus.textContent = `FILE ${index + 1} OF ${recoveredRecords} RECOVERED.`;
        }
        updateArchiveControls();
    }

    archiveButton?.addEventListener("click", () => {
        if (currentRecordIndex < recoveredRecords - 1) {
            showRecoveredRecord(currentRecordIndex + 1);
            playTone(650 + (currentRecordIndex + 1) * 35);
            return;
        }

        if (recoveredRecords < records.length) {
            const recordIndex = recoveredRecords;
            renderRecord(records[recordIndex], recordIndex);
            recoveredRecords += 1;
            currentRecordIndex = recordIndex;
            if (recoveredCount) {
                recoveredCount.textContent = String(recoveredRecords);
            }
            if (archiveProgress) {
                archiveProgress.value = recoveredRecords;
                archiveProgress.textContent = `${recoveredRecords} / 5`;
            }
            if (archiveStatus) {
                archiveStatus.textContent = `FILE ${recoveredRecords} OF ${records.length} RECOVERED.`;
            }
            updateArchiveControls();
            playTone(650 + recoveredRecords * 35);
            return;
        }

        archiveButton.hidden = true;
        if (completePanel) {
            completePanel.hidden = false;
            document.querySelector("[data-restart]")?.focus();
        }
        if (archiveStatus) {
            archiveStatus.textContent = "ARCHIVE RECOVERY COMPLETE.";
        }
        playTone(920);
    });

    previousRecordButton?.addEventListener("click", () => {
        if (currentRecordIndex <= 0) {
            return;
        }
        if (completePanel) {
            completePanel.hidden = true;
        }
        if (archiveButton) {
            archiveButton.hidden = false;
        }
        showRecoveredRecord(currentRecordIndex - 1);
    });

    document.querySelector("[data-restart]")?.addEventListener("click", () => {
        segmentsDecrypted = 0;
        challengeComplete = false;
        recoveredRecords = 0;
        currentRecordIndex = -1;
        resetLockTarget();
        if (segmentCount) {
            segmentCount.textContent = "0 / 3";
        }
        if (gameStatus) {
            gameStatus.textContent = "Awaiting input...";
        }
        if (recoveredCount) {
            recoveredCount.textContent = "0";
        }
        if (archiveProgress) {
            archiveProgress.value = 0;
            archiveProgress.textContent = "0 / 5";
        }
        if (recordContainer) {
            recordContainer.classList.remove("has-record-image");
            recordContainer.style.removeProperty("--record-image");
            const locked = document.createElement("p");
            locked.className = "locked-message";
            locked.textContent = "[ LOCKED ]";
            recordContainer.replaceChildren(locked);
        }
        if (archiveStatus) {
            archiveStatus.textContent = "";
        }
        if (completePanel) {
            completePanel.hidden = true;
        }
        if (archiveButton) {
            archiveButton.hidden = false;
        }
        updateArchiveControls();
        showStage("alert");
        initializeButton?.focus();
    });

    document.querySelectorAll("[data-program-dialog-target]").forEach((button) => {
        button.addEventListener("click", () => {
            const dialogId = button.getAttribute("data-program-dialog-target");
            const dialog = dialogId ? document.getElementById(dialogId) : null;
            if (dialog instanceof HTMLDialogElement) {
                dialog.showModal();
            }
        });
    });

    document.querySelectorAll("dialog.program-dialog").forEach((dialog) => {
        dialog.querySelector("[data-program-dialog-close]")?.addEventListener("click", () => {
            if (dialog instanceof HTMLDialogElement) {
                dialog.close();
            }
        });
        dialog.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && dialog instanceof HTMLDialogElement) {
                event.preventDefault();
                dialog.close();
            }
        });
        dialog.addEventListener("click", (event) => {
            if (event.target === dialog && dialog instanceof HTMLDialogElement) {
                dialog.close();
            }
        });
    });

    let profileDialogOpener = null;
    document.querySelectorAll("[data-profile-dialog-target]").forEach((button) => {
        button.addEventListener("click", () => {
            const dialogId = button.getAttribute("data-profile-dialog-target");
            const dialog = dialogId ? document.getElementById(dialogId) : null;
            if (dialog instanceof HTMLDialogElement) {
                profileDialogOpener = button;
                dialog.showModal();
                dialog.querySelector("[data-profile-dialog-close]")?.focus();
            }
        });
    });

    document.querySelectorAll("dialog.profile-dialog").forEach((dialog) => {
        dialog.querySelector("[data-profile-dialog-close]")?.addEventListener("click", () => {
            if (dialog instanceof HTMLDialogElement) {
                dialog.close();
            }
        });
        dialog.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && dialog instanceof HTMLDialogElement) {
                event.preventDefault();
                dialog.close();
            }
        });
        dialog.addEventListener("click", (event) => {
            if (event.target === dialog && dialog instanceof HTMLDialogElement) {
                dialog.close();
            }
        });
        dialog.addEventListener("close", () => {
            profileDialogOpener?.focus();
            profileDialogOpener = null;
        });
    });

    const programSearch = document.querySelector("[data-program-search]");
    if (programSearch instanceof HTMLInputElement) {
        const cards = Array.from(document.querySelectorAll("[data-program-card]"));
        const sections = Array.from(document.querySelectorAll("[data-program-section]"));
        const filters = Array.from(document.querySelectorAll("[data-program-filter]"));
        const resultStatus = document.querySelector("[data-program-results]");
        const emptyState = document.querySelector("[data-program-empty]");
        let activeCategory = "all";

        function updateProgramResults() {
            const query = programSearch.value.trim().toLocaleLowerCase();
            let visibleCount = 0;
            cards.forEach((card) => {
                const categoryMatches = activeCategory === "all" || card.dataset.programCategory === activeCategory;
                const queryMatches = card.textContent.toLocaleLowerCase().includes(query);
                card.hidden = !(categoryMatches && queryMatches);
                visibleCount += Number(!card.hidden);
            });

            sections.forEach((section) => {
                section.hidden = !cards.some((card) =>
                    card.dataset.programCategory === section.dataset.programSection && !card.hidden
                );
            });
            if (resultStatus) {
                resultStatus.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? "program" : "programs"}`;
            }
            if (emptyState) {
                emptyState.hidden = visibleCount !== 0;
            }
        }

        programSearch.addEventListener("input", updateProgramResults);
        filters.forEach((filter) => {
            filter.addEventListener("click", () => {
                activeCategory = filter.dataset.programFilter ?? "all";
                filters.forEach((button) => {
                    button.setAttribute("aria-pressed", String(button === filter));
                });
                updateProgramResults();
            });
        });
        updateProgramResults();
    }
})();
