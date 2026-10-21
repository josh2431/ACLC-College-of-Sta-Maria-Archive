const programDetails = {
    bscs: {
        programTitle: "Bachelor of Science in Computer Science",
        tagline: "It's what you learn that matters the most.",
        studentImage: "assets/comsci.jpg",
        curriculumCategories: [
            { title: "Systems Development & Data Analytics", topics: ["C Language", "Visual C++", "VB.NET", "Python", "R Programming", "SAP"] },
            { title: "Mobile Programming", topics: ["Java Programming", "Android Studio", "XCode", "Ionic", "NativeScript"] },
            { title: "Web Application Development", topics: ["JavaScript", "PHP with MySQL", "Bootstrap", "Laravel", "Cloud Networking", "Cybersecurity"] },
            { title: "Game Development", topics: ["C#", "Construct 2", "Unity 3D", "Clickteam Fusion", "GameRoot"] },
        ],
        whyChooseUs: [
            "Top-of-the-line development tools and equipment",
            "IT faculty with industry and development experience",
            "Academe-industry training partnerships",
        ],
    },
    bsais: {
        programTitle: "Bachelor of Science in Accounting Information System",
        tagline: "Connect financial insight with information systems.",
        studentImage: "assets/ais.jpg",
        curriculumCategories: [
            { title: "Accounting & Finance Core", topics: ["Microeconomics", "Macroeconomics", "Business Statistics", "Quantitative Techniques", "Business Research", "Technical Writing"] },
            { title: "Information Technology", topics: ["IT Concepts", "Systems Analysis", "Systems Design", "Accounting Information Systems", "Auditing", "CIS Environment"] },
            { title: "Business Law & Taxation", topics: ["Obligations and Contracts", "Negotiable Instruments", "Sales and Agency", "Labor Law", "Business Taxes", "Transfer Taxes"] },
            { title: "Financial Management", topics: ["Financial Accounting", "Financial Reporting", "Cost Accounting", "Management Accounting", "Applied Auditing"] },
        ],
        whyChooseUs: [
            "Instructors with accounting and professional expertise",
            "National Certificate assessment included",
            "Academe-industry training partnerships",
        ],
    },
    bsen: {
        programTitle: "Bachelor of Science in Entrepreneurship",
        tagline: "Build the skills to turn ideas into opportunity.",
        studentImage: "assets/entrep.jpg",
        curriculumCategories: [
            { title: "General Education", topics: ["Written Communication", "Oral Communication", "Quantitative Literacy", "Civic and Global Learning", "Business Ethics", "Good Governance"] },
            { title: "Business Foundations", topics: ["Financial Accounting", "Financial Management", "Managerial Accounting", "Business Law", "International Management", "Economics"] },
            { title: "People & Organizations", topics: ["Human Resource Management", "Organizational Behavior", "Organizational Development", "Labor Relations", "Public Relations", "Social Responsibility"] },
        ],
        whyChooseUs: [
            "Business-focused college instruction",
            "National Certificate assessment included",
            "Academe-industry training partnerships",
        ],
    },
    act: {
        programTitle: "Associate in Computer Technology",
        tagline: "Build practical foundations for a future in technology.",
        studentImage: "assets/act.jpg",
        curriculumCategories: [
            { title: "Computing Foundations", topics: ["Programming", "Statistics", "Operating Systems", "System Organization"] },
            { title: "Technology Skills", topics: ["Networking", "Database Management", "Software Engineering", "Cybersecurity"] },
        ],
        whyChooseUs: [
            "Top-of-the-line development tools and equipment",
            "IT faculty with industry and development experience",
            "Academe-industry training partnerships",
        ],
    },
};

function PhoneIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 text-rose-400">
            <path d="M7.2 3.5h2.6l1.3 4.1-1.8 1.5a14 14 0 0 0 5.6 5.6l1.5-1.8 4.1 1.3v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 5.2 5.7a2 2 0 0 1 2-2.2Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function AddressIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 text-rose-400">
            <path d="M19 10.2c0 5-7 10.3-7 10.3S5 15.2 5 10.2a7 7 0 1 1 14 0Z" stroke="currentColor" strokeWidth="1.7" />
            <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.7" />
        </svg>
    );
}

function ProgramModal({ program, onClose }) {
    const dialogRef = React.useRef(null);

    React.useEffect(() => {
        dialogRef.current?.showModal();
    }, []);

    function closeModal() {
        dialogRef.current?.close();
        onClose(program);
    }

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby="program-modal-title"
            aria-describedby="program-modal-tagline"
            onKeyDown={(event) => {
                if (event.key === "Escape") {
                    event.preventDefault();
                    closeModal();
                }
            }}
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    closeModal();
                }
            }}
            className="fixed inset-0 m-auto w-[min(1180px,calc(100vw-2rem))] max-w-none max-h-[92dvh] overflow-hidden rounded-lg border border-rose-400/50 bg-slate-950 p-0 font-mono text-slate-100 shadow-2xl backdrop:bg-slate-950/85 backdrop:backdrop-blur-sm"
        >
            <div className="grid max-h-[92dvh] grid-cols-1 overflow-y-auto lg:h-[min(780px,88dvh)] lg:max-h-[88dvh] lg:grid-cols-[minmax(0,3fr)_minmax(18rem,2fr)] lg:overflow-hidden">
                <section className="flex min-w-0 flex-col bg-slate-950 p-5 text-base sm:p-8 lg:overflow-y-auto lg:p-10">
                    <header className="relative border-b border-slate-700 pb-6 pr-12">
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">ACLC College of Sta. Maria</p>
                        <h2 id="program-modal-title" className="text-2xl font-bold leading-tight text-white sm:text-3xl">{program.programTitle}</h2>
                        <p id="program-modal-tagline" className="mt-3 text-lg text-slate-100">{program.tagline}</p>
                        <button
                            type="button"
                            aria-label="Close program details"
                            onClick={closeModal}
                            className="absolute right-0 top-0 grid h-10 w-10 place-items-center rounded-full border border-slate-600 bg-slate-900 text-3xl leading-none text-slate-100 transition hover:border-rose-400 hover:text-rose-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                    </header>

                    <div className="py-6">
                        <h3 className="mb-5 text-base font-bold uppercase tracking-[0.16em] text-sky-300">Curriculum highlights</h3>
                        <div className="space-y-6">
                            {program.curriculumCategories.map((category) => (
                                <section key={category.title}>
                                    <h4 className="mb-3 text-base font-semibold text-white">{category.title}</h4>
                                    <ul className="flex flex-wrap gap-2" aria-label={category.title}>
                                        {category.topics.map((topic) => (
                                            <li key={topic} className="rounded-md border border-slate-600 bg-slate-900 px-3 py-1.5 text-base leading-snug text-slate-100">{topic}</li>
                                        ))}
                                    </ul>
                                </section>
                            ))}
                        </div>

                        <section className="mt-8 border-t border-slate-700 pt-6">
                            <h3 className="mb-4 text-base font-bold uppercase tracking-[0.16em] text-sky-300">Why choose ACLC?</h3>
                            <ul className="space-y-3">
                                {program.whyChooseUs.map((highlight) => (
                                    <li key={highlight} className="flex gap-3 text-base leading-relaxed text-slate-100">
                                        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="mt-0.5 h-5 w-5 shrink-0 text-rose-400">
                                            <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span>{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    <footer className="mt-auto grid gap-4 border-t border-slate-700 pt-5 text-base sm:grid-cols-2">
                        <a href="tel:09171366167" className="flex items-center gap-3 text-slate-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-400">
                            <PhoneIcon />
                            <span><span className="block text-sm uppercase tracking-wider text-slate-400">Phone</span>0917-136-6167</span>
                        </a>
                        <div className="flex items-center gap-3 text-slate-200">
                            <AddressIcon />
                            <span><span className="block text-sm uppercase tracking-wider text-slate-400">Address</span>Sta. Maria, Bulacan, Philippines</span>
                        </div>
                    </footer>
                </section>

                <figure className="relative flex min-h-64 items-center justify-center overflow-hidden border-t border-rose-400/30 bg-slate-950 p-2 lg:min-h-0 lg:border-l lg:border-t-0">
                    <img src={program.studentImage} alt={`${program.programTitle} program poster featuring a student`} className="h-full max-h-full w-full object-contain object-center" />
                </figure>
            </div>
        </dialog>
    );
}

function ProgramModalApp() {
    const [program, setProgram] = React.useState(null);
    const openerRef = React.useRef(null);

    React.useEffect(() => {
        if (!program && openerRef.current) {
            openerRef.current.focus();
        }
    }, [program]);

    React.useEffect(() => {
        function handleProgramOpen(event) {
            const button = event.target instanceof Element
                ? event.target.closest("[data-program-modal-id]")
                : null;
            if (!button) {
                return;
            }

            const selectedProgram = programDetails[button.dataset.programModalId];
            if (!selectedProgram) {
                return;
            }

            openerRef.current = button;
            setProgram(selectedProgram);
        }

        document.addEventListener("click", handleProgramOpen);
        return () => document.removeEventListener("click", handleProgramOpen);
    }, []);

    function handleClose(closedProgram) {
        setProgram((currentProgram) => {
            return currentProgram === closedProgram ? null : currentProgram;
        });
    }

    return program ? <ProgramModal program={program} onClose={handleClose} /> : null;
}

ReactDOM.createRoot(document.getElementById("program-modal-root")).render(<ProgramModalApp />);
