document.addEventListener("DOMContentLoaded", function () {
    // Initialize autosize for note textareas
    initAutosize();
    // Initialize Masonry for note layout
    initMasonry();
    // Load notes from local storage
    loadNotes();
    // Add event listeners for various functionalities
    addEventListeners();

    // Function to initialize autosize for textareas
    function initAutosize() {
        const textareas = document.querySelectorAll('textarea');
        autosize(textareas);
    }

    // Function to initialize Masonry layout
    function initMasonry() {
        const notesContainer = document.querySelector('#notesContainer');
        if (notesContainer) {
            new Masonry(notesContainer, {
                itemSelector: '.col',
                columnWidth: '.col',
                percentPosition: true
            });
        }
    }

    // Function to load notes from local storage and add them to the DOM
    function loadNotes() {
        try {
            const notes = JSON.parse(localStorage.getItem('notes')) || [];
            notes.forEach(note => addNoteToDOM(note));
        } catch (error) {
            console.error('Error loading notes:', error);
        }
    }

    // Function to add event listeners for various elements
    function addEventListeners() {
        document.addEventListener('click', handleDocumentClick);
        document.getElementById('undoButton').addEventListener('click', () => document.execCommand('undo'));
        document.getElementById('redoButton').addEventListener('click', () => document.execCommand('redo'));
        document.querySelector('input[type="search"]').addEventListener('input', handleSearchInput);
        document.getElementById('cancelButton').addEventListener('click', resetForm);
    }

    // Function to handle clicks outside the note form
    function handleDocumentClick(event) {
        const noteForm = document.getElementById('noteForm');
        if (!noteForm.contains(event.target)) {
            saveNote();
        }
    }

    // Function to handle real-time search input
    function handleSearchInput(event) {
        filterNotes(event.target.value);
    }

    // Function to reset the note form fields
    function resetForm() {
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteContent').value = '';
        autosize.update(document.querySelectorAll('textarea'));
    }

    // Function to save a note to local storage
    function saveNote() {
        const title = document.getElementById('noteTitle').value.trim();
        const content = document.getElementById('noteContent').value.trim();

        if (title || content) {
            const note = { title, content, id: Date.now() };
            try {
                let notes = JSON.parse(localStorage.getItem('notes')) || [];
                notes.push(note);
                localStorage.setItem('notes', JSON.stringify(notes));
                addNoteToDOM(note);
                resetForm();
            } catch (error) {
                console.error('Error saving note:', error);
            }
        }
    }

    // Function to add a note element to the DOM
    function addNoteToDOM(note) {
        const notesContainer = document.getElementById('notesContainer');
        const noteElement = document.createElement('div');
        noteElement.classList.add('col');
        noteElement.innerHTML = `
            <article class="card rounded-3 custom-bg border-light border-opacity-50">
                <div class="card-body user-select-none">
                    <h5 class="card-title text-light mb-3">${note.title}</h5>
                    <p class="card-text text-light" style="font-size: 0.875rem;">${note.content}</p>
                </div>
                <div class="card-footer border-top-0 d-lg-flex justify-content-lg-between align-items-center">
                    <button class="btn btn-sm btn-outline-light border-0 rounded-5 opacity-75 me-1" title="Add reminder"><i class="bi bi-bell"></i></button>
                    <button class="btn btn-sm btn-outline-light border-0 rounded-5 opacity-75 me-1" title="Collaborator"><i class="bi bi-person-plus"></i></button>
                    <button class="btn btn-sm btn-outline-light border-0 rounded-5 opacity-75 me-1" title="Background options"><i class="bi bi-palette"></i></button>
                    <button class="btn btn-sm btn-outline-light border-0 rounded-5 opacity-75 me-1" title="Add image"><i class="bi bi-image"></i></button>
                    <button class="btn btn-sm btn-outline-light border-0 rounded-5 opacity-75 me-1" title="Archive"><i class="bi bi-archive"></i></button>
                    <button class="btn btn-sm btn-outline-light border-0 rounded-5 opacity-75 me-1 delete-note" title="Delete"><i class="bi bi-trash3"></i></button>
                </div>
            </article>
        `;
        noteElement.querySelector('.delete-note').addEventListener('click', () => deleteNote(note.id));
        notesContainer.appendChild(noteElement);

        updateMasonryLayout();
    }

    // Function to delete a note by ID
    function deleteNote(id) {
        try {
            let notes = JSON.parse(localStorage.getItem('notes')) || [];
            notes = notes.filter(note => note.id !== id);
            localStorage.setItem('notes', JSON.stringify(notes));
            document.getElementById('notesContainer').innerHTML = '';
            loadNotes();
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    }

    // Function to filter notes based on search query
    function filterNotes(query) {
        const notesContainer = document.getElementById('notesContainer');
        const notes = notesContainer.querySelectorAll('.col');

        notes.forEach(note => {
            const title = note.querySelector('.card-title').textContent.toLowerCase();
            const content = note.querySelector('.card-text').textContent.toLowerCase();

            if (title.includes(query.toLowerCase()) || content.includes(query.toLowerCase())) {
                note.style.display = '';
            } else {
                note.style.display = 'none';
            }
        });

        updateMasonryLayout();
    }

    // Function to update Masonry layout
    function updateMasonryLayout() {
        const notesContainer = document.querySelector('#notesContainer');
        if (notesContainer) {
            const masonry = new Masonry(notesContainer, {
                itemSelector: '.col',
                columnWidth: '.col',
                percentPosition: true
            });
            masonry.layout();
        }
    }
});
