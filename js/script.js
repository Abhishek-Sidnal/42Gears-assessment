class TableManager {
    constructor(config) {
        this.currentPage = 1;
        this.rowsPerPage = config.rowsPerPage || 10;
        this.data = config.data || [];
        this.tableBody = document.querySelector(config.tableBodySelector);
        this.searchInput = document.querySelector(config.searchInputSelector);
        this.pageInfo = document.querySelector(config.pageInfoSelector);
        this.prevPageBtn = document.querySelector(config.prevPageBtnSelector);
        this.nextPageBtn = document.querySelector(config.nextPageBtnSelector);
        this.editBtn = document.querySelector(config.editBtnSelector);
        this.deleteBtn = document.querySelector(config.deleteBtnSelector);
        this.refreshBtn = document.querySelector(config.refreshBtnSelecter);
        this.itemsPerPageSelect = document.querySelector(config.itemsPerPageSelectSelector);
        this.selectedRow = null;
        
        this.init();
    }

    init() {
        this.fetchData();
        this.searchInput.addEventListener("input", () => this.handleSearch());
        this.itemsPerPageSelect.addEventListener("change", () => this.handleItemsPerPageChange());
        this.prevPageBtn.addEventListener("click", () => this.handlePrevPage());
        this.nextPageBtn.addEventListener("click", () => this.handleNextPage());
        this.editBtn.addEventListener("click", () => this.handleEdit());
        this.deleteBtn.addEventListener("click", () => this.handleDelete());
        this.refreshBtn.addEventListener("click", () => { this.handleRefresh() })
    }

    fetchData() {
        fetch('./data/data.json')
            .then(response => response.json())
            .then(jsonData => {
                this.data = jsonData;
                this.populateTable(this.paginate(this.data, this.currentPage, this.rowsPerPage));
                this.updatePageInfo(this.data.length);
            })
            .catch(error => console.error('Error loading JSON data:', error));
    }

    populateTable(dataToShow) {
        this.tableBody.innerHTML = "";
        dataToShow.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>${item.date}</td>
                <td>${item.tags.map(tag => `<span class="tag" style='background-color:${tag.tcolor}'>${tag.tname}</span>`).join('')}</td>
            `;
            row.dataset.index = index;
            row.addEventListener("click", (event) => this.handleRowSelection(event, row));
            this.tableBody.appendChild(row);
        });
    }

    paginate(dataArray, pageNumber, rowsPerPage) {
        const start = (pageNumber - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return dataArray.slice(start, end);
    }

    updatePageInfo(dataLength) {
        const totalPages = Math.ceil(dataLength / this.rowsPerPage);
        this.pageInfo.textContent = `${this.currentPage} - ${totalPages} of ${totalPages}`;
        this.prevPageBtn.disabled = this.currentPage === 1;
        this.nextPageBtn.disabled = this.currentPage === totalPages;
    }

    handleSearch() {
        this.currentPage = 1;
        const filteredData = this.applySearchFilter();
        this.populateTable(this.paginate(filteredData, this.currentPage, this.rowsPerPage));
        this.updatePageInfo(filteredData.length);
    }

    applySearchFilter() {
        const searchText = this.searchInput.value.toLowerCase();
        return this.data.filter(item =>
            item.name.toLowerCase().includes(searchText) ||
            item.email.toLowerCase().includes(searchText)
        );
    }

    handleItemsPerPageChange() {
        this.rowsPerPage = parseInt(this.itemsPerPageSelect.value);
        this.currentPage = 1;
        this.populateTable(this.paginate(this.applySearchFilter(), this.currentPage, this.rowsPerPage));
        this.updatePageInfo(this.data.length);
    }

    handlePrevPage() {
        this.currentPage--;
        this.populateTable(this.paginate(this.applySearchFilter(), this.currentPage, this.rowsPerPage));
        this.updatePageInfo(this.data.length);
    }

    handleNextPage() {
        this.currentPage++;
        this.populateTable(this.paginate(this.applySearchFilter(), this.currentPage, this.rowsPerPage));
        this.updatePageInfo(this.data.length);
    }

    handleRowSelection(event, row) {
        if (this.selectedRow) {
            this.selectedRow.classList.remove("selected-row");
        }

        this.selectedRow = row;
        this.selectedRow.classList.add("selected-row");
        this.editBtn.disabled = false;
        this.deleteBtn.disabled = false;
    }

    handleRefresh() {
        this.searchInput.value = '';
        this.currentPage = 1;

        if (this.selectedRow) {
            this.selectedRow.classList.remove("selected-row");
            this.selectedRow = null;
            this.editBtn.disabled = true;
            this.deleteBtn.disabled = true;
        }

        this.fetchData();
    }

    handleEdit() {
        if (this.selectedRow) {
            const cells = this.selectedRow.querySelectorAll("td");

            if (this.isEditing) {
                for (let i = 1; i <= 3; i++) {
                    cells[i].setAttribute("contenteditable", "false");
                    cells[i].style.backgroundColor = "";
                }
                const index = this.selectedRow.dataset.index;
                this.data[index].name = cells[1].innerText;
                this.data[index].email = cells[2].innerText;
                this.data[index].date = cells[3].innerText;

                this.editBtn.innerHTML = '<i class="fa fa-pencil"></i>';
                this.editBtn.disabled = true;
                this.deleteBtn.disabled = true;

                this.selectedRow.classList.remove("selected-row");
                this.selectedRow = null;
                this.isEditing = false;
            } else {
                for (let i = 1; i <= 3; i++) {
                    cells[i].setAttribute("contenteditable", "true");
                    cells[i].style.backgroundColor = "#e0f7fa";
                }
                cells[1].focus();
                this.editBtn.innerHTML = '<i class="fa fa-save"></i>';
                this.isEditing = true;
            }
        }
    }

    handleDelete() {
        if (this.selectedRow) {
            const index = this.selectedRow.dataset.index;
            this.data.splice(index, 1);
            this.selectedRow.remove();
            this.selectedRow = null;
            this.editBtn.disabled = true;
            this.deleteBtn.disabled = true;
            this.populateTable(this.paginate(this.applySearchFilter(), this.currentPage, this.rowsPerPage));
            this.updatePageInfo(this.data.length);
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const tableManager = new TableManager({
        tableBodySelector: "#data-table tbody",
        searchInputSelector: "#search",
        pageInfoSelector: ".page-info",
        prevPageBtnSelector: "#prev-page",
        nextPageBtnSelector: "#next-page",
        editBtnSelector: "#edit-btn",
        refreshBtnSelecter: "#refresh-btn",
        deleteBtnSelector: "#delete-btn",
        itemsPerPageSelectSelector: "#items-per-page",
        rowsPerPage: 10
    });
});
