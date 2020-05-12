(async () => {

  /**
   * Data table setup
   * 
   * @return {DataTable}
   */
  async function setupDataTable(lang) {
    const langJson = JSON.parse((await $.get(`node_modules/datatables.net-plugins/i18n/${lang}.lang`)).replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, ''));
    const dt = $('#table').DataTable({
      columnDefs: [
        { data: 'name', targets: 0 },
        { data: 'position', targets: 1 },
        { data: 'office', targets: 2 },
        { data: 'age', targets: 3 },
        { data: 'date', targets: 4 },
        { data: 'salary', targets: 5 }
      ],
      dom:
        `<'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>>
        <'row'<'col-sm-12'tr>>
        <'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>`,
      language: langJson,

      // Option to get table data from server side
      // processing: true,// Set to true to display server side data loading message.
      serverSide: true,
      ajax: {
        url: 'server-side/server_processing.php',

        // If you don't want to change the data structure returned by the server, customize the data with the "ajax.data" option.
        dataFilter: data => {
          data = JSON.parse(data);
          data.recordsTotal = data.total;
          data.recordsFiltered = data.total;
          data.data = data.list;
          return JSON.stringify(data); // return JSON string
        }
      }
    });
    return dt;
  }

  /**
   * Table data load
   * 
   * @return {void}
   */
  async function loadTableData() {
    const rows = await $.getJSON('data.json');
    for (let row of rows) {
      dt.row.add(row);
    }
    dt.draw(false);
  }

  // language
  const $lang = $('#lang');
  if (Cookies.get('lang')) {
    $lang.val(Cookies.get('lang'));
  }

  // Data table setup
  const dt = await setupDataTable($lang.val());

  // // Load data from server
  // loadTableData();

  // Change language
  $lang.on('change', () => {
    Cookies.set('lang', $lang.val());
    location.reload();
  });
})();
