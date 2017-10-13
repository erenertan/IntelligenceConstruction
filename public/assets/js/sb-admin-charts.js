// Chart.js scripts
// -- Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';
// -- Area Chart Example
{

  $(document).ready(function () {
      function loadData() {
          $.ajax({
              method: "GET",
              url: "data.html",
              dataType: "json",
          }).done(function (data) {
              for (var i = 0; i < data.length; i++) {
                  $('#dataTable').append(
                      '<tr>' +
                      '<td>' + '001' + i + '</td>' +
                      '<td>' + 'Kullanıcı ' + i + '</td>' +
                      '<td>' + data[i].agirlik + '</td>' +
                      '<td>' + data[i].lon + '</td>' +
                      '<td>' + data[i].lat + '</td>' +
                      '</tr>'
                  )
              }
          })
      }
  })
}

