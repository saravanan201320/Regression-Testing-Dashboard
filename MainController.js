  var mainPageControllers = angular.module('mainPageControllers', ['ngMaterial', 'ngMessages','ngStorage', 'googlechart', 'angular.filter', 'ngSanitize', 'ngFileUpload', 'ngXlsx']);
  mainPageControllers.controller('mainPageController', ['$scope', '$http', '$filter', '$rootScope', '$location','$localStorage', '$sce', '$mdDialog', '$mdMedia', 'Upload', '$timeout', '$interval', 'ngXlsx',
   function($scope, $http, $filter, $rootScope, $location,$localStorage, $sce, $mdDialog, $mdMedia, Upload, $timeout, $interval, ngXlsx) {
    if($localStorage.groups == null){   
        $location.path("/uploadPage");       
    }
    else{
      $rootScope.groups = $localStorage.groups;
      var jsonData = JSON.parse($rootScope.groups)      
       //var key = Object.keys(jsonData);
      $rootScope.dataHeader = Object.keys(jsonData[0]);
      loadData($rootScope.dataHeader, jsonData);
      // console.log($rootScope.groups);
    }
    $scope.fileLabel = true;
    $scope.excelLabel = true;
    $scope.progressLabel = true;
    var self = this,
     j = 0,
     counter = 0;
    self.mode = 'query';
    self.activated = true;
    self.determinateValue = 30;
    self.determinateValue2 = 30;
    self.modes = [];
    /**
     * Turn off or on the 5 themed loaders
     */
    self.toggleActivation = function() {
     if (!self.activated) self.modes = [];
     if (self.activated) {
      j = counter = 0;
      self.determinateValue = 30;
      self.determinateValue2 = 30;
     }
    };
    $interval(function() {
     self.determinateValue += 1;
     self.determinateValue2 += 1.5;
     if (self.determinateValue > 100) self.determinateValue = 30;
     if (self.determinateValue2 > 100) self.determinateValue2 = 30;
     // Incrementally start animation the five (5) Indeterminate,
     // themed progress circular bars
     if ((j < 2) && !self.modes[j] && self.activated) {
      self.modes[j] = (j == 0) ? 'buffer' : 'query';
     }
     if (counter++ % 4 == 0) j++;
     // Show the indicator in the "Used within Containers" after 200ms delay
     if (j == 2) self.contained = "indeterminate";
    }, 100, 0, true);
    $interval(function() {
     self.mode = (self.mode == 'query' ? 'determinate' : 'query');
    }, 7200, 0, true);
    $scope.status = '  ';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    $scope.showAlert = function(ev) {
     // Appending dialog to document.body to cover sidenav in docs app
     // Modal dialogs should fully cover application
     // to prevent interaction outside of dialog
     $mdDialog.show(
      $mdDialog.alert()
      .parent(angular.element(document.querySelector('#popupContainer')))
      .clickOutsideToClose(true)
      .title('This is an alert title')
      .textContent('You can specify some description text in here.')
      .ariaLabel('Alert Dialog Demo')
      .ok('Got it!')
      .targetEvent(ev)
     );
    };
    $scope.showConfirm = function(ev) {
     // Appending dialog to document.body to cover sidenav in docs app
     var confirm = $mdDialog.confirm()
      .title('Would you like to delete your debt?')
      .textContent('All of the banks have agreed to forgive you your debts.')
      .ariaLabel('Lucky day')
      .targetEvent(ev)
      .ok('Please do it!')
      .Cancel('Sounds like a scam');
     $mdDialog.show(confirm).then(function() {
      $scope.status = 'You decided to get rid of your debt.';
     }, function() {
      $scope.status = 'You decided to keep your debt.';
     });
    };
    $scope.$watch('files', function() {
     $scope.upload($scope.files);
    });
    $scope.$watch('file', function() {
     if ($scope.file != null) {
      $scope.files = [$scope.file];
     }
    });
    $scope.log = '';
    $scope.upload = function(files) {
     if (files && files.length) {
      $scope.fileLabel = false;
      $scope.uploadedFile = files;
      for (var i = 0; i < files.length; i++) {
       var file = files[i];
       console.log(file);
       if (!file.$error) {
        Upload.upload({
         url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
         data: {
          username: $scope.username,
          file: file
         }
        }).progress(function(evt) {
         var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
         $scope.log = 'progress: ' + progressPercentage + '% ' +
          evt.config.data.file.name + '\n' + $scope.log;
         $scope.progress = progressPercentage;
         $scope.progressLabel = false;
        }).success(function(data, status, headers, config) {
         fileChanged($scope.uploadedFile);
         $timeout(function() {
          $scope.log = 'file: ' + config.data.file.name + ', Response: ' + JSON.stringify(data) + '\n' + $scope.log;
         });
        });
       }
      }
     }
    };
    function fileChanged(files) {
     $scope.excelFile = files[0];
     console.log("--->" + $scope.excelFile);
     XLSXReader($scope.excelFile, true, true, function(data) {
      $scope.sheets = data.sheets;
      $scope.json_string = JSON.stringify($scope.sheets["sheet"], null, 2);
      $localStorage.groups = $scope.json_string;
      $rootScope.groups = $localStorage.groups;
      console.log($rootScope.groups)
       // console.log($rootScope.groups);          
      $rootScope.$apply();
     });
    }
    function DialogController($scope, $rootScope, $mdDialog) {
     $scope.hide = function() {
      $mdDialog.hide();
     };

     $scope.Cancel = function() {
      $mdDialog.cancel();
     };

     $scope.Upload = function(Upload) {
      $mdDialog.hide(Upload);
      var jsonData = JSON.parse($rootScope.groups)      
       //var key = Object.keys(jsonData);
      $rootScope.dataHeader = Object.keys(jsonData[0]);
      loadData($rootScope.dataHeader, jsonData);
      // console.log($rootScope.dataHeader);
     };
    }

    $scope.dataUpload = function(){
      var jsonData = JSON.parse($rootScope.groups);    
       //var key = Object.keys(jsonData);
      $rootScope.dataHeader = Object.keys(jsonData[0]);
      loadData($rootScope.dataHeader, jsonData);
      console.log("hi");
      $location.path("/level1Page");
    }

    function loadData(dataHeader, jsonData) {
      if (dataHeader.length == 7) {
      var level1DataHeader = dataHeader[0];
      $rootScope.level1DataHeader = level1DataHeader;
      var level2DataHeader = dataHeader[1];
      $rootScope.mainPageData = [];
      console.log(level1DataHeader);
      $scope.level1Data = [];
      

      for (var i = 0; i < jsonData.length; i++) {
       $scope.level1Data.push(jsonData[i][level1DataHeader]);
      }
      $scope.level1Data = $filter('unique')($scope.level1Data);
      console.log($scope.level1Data);
      console.log($scope.level1Data.length);
      for (var j = 0; j < $scope.level1Data.length; j++) {
       $scope.level2Data = [];
       $scope.POC = [];
       $scope.totalNumberOfTestCases = 0;
       $scope.automatedCount = 0;
       $scope.manualCount = 0;
       $scope.automated = 0;
       console.log($scope.level1Data[j]);       
       for (var k = 0; k < jsonData.length; k++) {
        if (jsonData[k][level1DataHeader] == $scope.level1Data[j]) {
         $scope.level2Data.push(jsonData[k][level2DataHeader]);
         $scope.totalNumberOfTestCases = parseInt(jsonData[k][dataHeader[3]]) + $scope.totalNumberOfTestCases;
         // console.log($scope.totalNumberOfTestCases+"----"+jsonData[k][dataHeader[4]]);
         $scope.automatedCount = parseInt(jsonData[k][dataHeader[4]]) + $scope.automatedCount;
         $scope.manualCount = parseInt(jsonData[k][dataHeader[5]]) + $scope.manualCount;
         $scope.POC.push(jsonData[k][dataHeader[6]]);
        }
       }
       $scope.level2Data = $filter('unique')($scope.level2Data);
       $scope.automated = ($scope.automatedCount / $scope.totalNumberOfTestCases) * 100;
       $scope.automated = $filter('number')($scope.automated, 0);
       $scope.POC = $filter('unique')($scope.POC);
       // console.log("Length: "+$scope.level2Data.length +" Total: "+$scope.totalNumberOfTestCases+" Automated: "+$scope.automatedCount+" Manual: "+$scope.manualCount+" Automated in % : "+$scope.automated);                 
       $rootScope.mainPageData.push([JSON.stringify({
        "title": $scope.level1Data[j],
        "l1": $scope.level2Data.length + ' Applications',
        "l2": $scope.automated + '% Automated',
        "l3": $scope.totalNumberOfTestCases + ' Test Cases',
        "l4": "POC : "+ $scope.POC         
       }), level1DataHeader, $scope.level2Data.length, $scope.automated]);
      }
      loadMap();
      // console.log($scope.mainPageData);
     }
     if (dataHeader.length == 8) {
      
      var level1DataHeader = dataHeader[0];
      $rootScope.level1DataHeader = level1DataHeader;
      var level2DataHeader = dataHeader[1];
      $rootScope.mainPageData = [];
      console.log(level1DataHeader);
      $scope.level1Data = [];

      for (var i = 0; i < jsonData.length; i++) {
       $scope.level1Data.push(jsonData[i][level1DataHeader]);
      }
      $scope.level1Data = $filter('unique')($scope.level1Data);
      console.log($scope.level1Data);
      console.log($scope.level1Data.length);
      for (var j = 0; j < $scope.level1Data.length; j++) {
       $scope.POC = [];
       $scope.level2Data = [];
       $scope.totalNumberOfTestCases = 0;
       $scope.automatedCount = 0;
       $scope.manualCount = 0;
       $scope.automated = 0;
       console.log($scope.level1Data[j]);
       for (var k = 0; k < jsonData.length; k++) {
        if (jsonData[k][level1DataHeader] == $scope.level1Data[j]) {
         $scope.level2Data.push(jsonData[k][level2DataHeader]);
         $scope.totalNumberOfTestCases = parseInt(jsonData[k][dataHeader[4]]) + $scope.totalNumberOfTestCases;
         // console.log($scope.totalNumberOfTestCases+"----"+jsonData[k][dataHeader[4]]);
         $scope.automatedCount = parseInt(jsonData[k][dataHeader[5]]) + $scope.automatedCount;
         $scope.manualCount = parseInt(jsonData[k][dataHeader[6]]) + $scope.manualCount;
         $scope.POC.push(jsonData[k][dataHeader[7]]);
        }
       }
       $scope.level2Data = $filter('unique')($scope.level2Data);
       $scope.automated = ($scope.automatedCount / $scope.totalNumberOfTestCases) * 100;
       $scope.automated = $filter('number')($scope.automated, 0);
       $scope.POC = $filter('unique')($scope.POC);
       // console.log("Length: "+$scope.level2Data.length +" Total: "+$scope.totalNumberOfTestCases+" Automated: "+$scope.automatedCount+" Manual: "+$scope.manualCount+" Automated in % : "+$scope.automated);                 
       $rootScope.mainPageData.push([JSON.stringify({
        "title": $scope.level1Data[j],
        "l1": $scope.level2Data.length + ' Applications',
        "l2": $scope.automated + '% Automated',
        "l3": $scope.totalNumberOfTestCases + ' Test Cases',
        "l4": "POC : "+ $scope.POC
       }), level1DataHeader, $scope.level2Data.length, $scope.automated]);
      }
      loadMap();
      // console.log($scope.mainPageData);
     }
     if (dataHeader.length == 9) {
      var level1DataHeader = dataHeader[0];
      $rootScope.level1DataHeader = level1DataHeader;
      var level2DataHeader = dataHeader[1];
      $rootScope.mainPageData = [];
      console.log(level1DataHeader);
      $scope.level1Data = [];
      

      for (var i = 0; i < jsonData.length; i++) {
       $scope.level1Data.push(jsonData[i][level1DataHeader]);
      }
      $scope.level1Data = $filter('unique')($scope.level1Data);
      console.log($scope.level1Data);
      console.log($scope.level1Data.length);
      for (var j = 0; j < $scope.level1Data.length; j++) {
       $scope.POC = [];
       $scope.level2Data = [];
       $scope.totalNumberOfTestCases = 0;
       $scope.automatedCount = 0;
       $scope.manualCount = 0;
       $scope.automated = 0;
       console.log($scope.level1Data[j]);
       for (var k = 0; k < jsonData.length; k++) {
        if (jsonData[k][level1DataHeader] == $scope.level1Data[j]) {
         $scope.level2Data.push(jsonData[k][level2DataHeader]);
         $scope.totalNumberOfTestCases = parseInt(jsonData[k][dataHeader[5]]) + $scope.totalNumberOfTestCases;
         // console.log($scope.totalNumberOfTestCases+"----"+jsonData[k][dataHeader[4]]);
         $scope.automatedCount = parseInt(jsonData[k][dataHeader[6]]) + $scope.automatedCount;
         $scope.manualCount = parseInt(jsonData[k][dataHeader[7]]) + $scope.manualCount;
         $scope.POC.push(jsonData[k][dataHeader[8]]);
        }
       }
       $scope.level2Data = $filter('unique')($scope.level2Data);
       $scope.automated = ($scope.automatedCount / $scope.totalNumberOfTestCases) * 100;
       $scope.automated = $filter('number')($scope.automated, 0);
       $scope.POC = $filter('unique')($scope.POC);
       // console.log("Length: "+$scope.level2Data.length +" Total: "+$scope.totalNumberOfTestCases+" Automated: "+$scope.automatedCount+" Manual: "+$scope.manualCount+" Automated in % : "+$scope.automated);                 
       $rootScope.mainPageData.push([JSON.stringify({
        "title": $scope.level1Data[j],
        "l1": $scope.level2Data.length + ' Applications',
        "l2": $scope.automated + '% Automated',
        "l3": $scope.totalNumberOfTestCases + ' Test Cases',
        "l4": "POC : "+ $scope.POC
       }), level1DataHeader, $scope.level2Data.length, $scope.automated]);
      }
      loadMap();
      // console.log($scope.mainPageData);
     }
    }
    $scope.excelDD = function() {
     console.log($scope.selectedItem)
     if ($scope.selectedItem != 'Default')
      $scope.excelLabel = false;
     else
      $scope.excelLabel = true;
    }
    $scope.generateTemplate = function() {
     if ($scope.selectedItem == 1) {
      $scope.level1 = document.getElementById('level1').value;
      var result = ngXlsx.writeXlsx([{
       sheetName: "sheet",
       columnDefs: [{
        field: "level1",
        displayName: $scope.level1
       }, {
        field: "manual",
        displayName: "Manual"
       }, {
        field: "automated",
        displayName: "Automated"
       },{
        field: "POC",
        displayName: "POC"
       }],
       data: []
      }]);
     }
     if ($scope.selectedItem == 2) {
      $scope.level1 = document.getElementById('level1').value;
      $scope.level2 = document.getElementById('level2').value;
      var result = ngXlsx.writeXlsx([{
       sheetName: "sheet",
       columnDefs: [{
        field: "level1",
        displayName: $scope.level1
       }, {
        field: "level2",
        displayName: $scope.level2
       }, {
        field: "totalNumberOfTestCases",
        displayName: "Total Number Of Test Cases"
       }, {
        field: "manual",
        displayName: "Manual"
       }, {
        field: "automated",
        displayName: "Automated"
       },{
        field: "POC",
        displayName: "POC"
       }],
       data: []
      }]);
     }
     if ($scope.selectedItem == 3) {
      $scope.level1 = document.getElementById('level1').value;
      $scope.level2 = document.getElementById('level2').value;
      $scope.level3 = document.getElementById('level3').value;
      var result = ngXlsx.writeXlsx([{
       sheetName: "sheet",
       columnDefs: [{
        field: "level1",
        displayName: $scope.level1
       }, {
        field: "level2",
        displayName: $scope.level2
       }, {
        field: "level3",
        displayName: $scope.level3
       }, {
        field: "totalNumberOfTestCases",
        displayName: "Total Number Of Test Cases"
       }, {
        field: "manual",
        displayName: "Manual"
       }, {
        field: "automated",
        displayName: "Automated"
       },{
        field: "POC",
        displayName: "POC"
       }],
       data: []
      }]);
     }
     if ($scope.selectedItem == 4) {
      $scope.level1 = document.getElementById('level1').value;
      $scope.level2 = document.getElementById('level2').value;
      $scope.level3 = document.getElementById('level3').value;
      $scope.level4 = document.getElementById('level4').value;
      var result = ngXlsx.writeXlsx([{
       sheetName: "sheet",
       columnDefs: [{
        field: "level1",
        displayName: $scope.level1
       }, {
        field: "level2",
        displayName: $scope.level2
       }, {
        field: "level3",
        displayName: $scope.level3
       }, {
        field: "level4",
        displayName: $scope.level4
       }, {
        field: "totalNumberOfTestCases",
        displayName: "Total Number Of Test Cases"
       }, {
        field: "manual",
        displayName: "Manual"
       }, {
        field: "automated",
        displayName: "Automated"
       },{
        field: "POC",
        displayName: "POC"
       }],
       data: []
      }]);
     }
     if ($scope.selectedItem == 5) {
      $scope.level1 = document.getElementById('level1').value;
      $scope.level2 = document.getElementById('level2').value;
      $scope.level3 = document.getElementById('level3').value;
      $scope.level4 = document.getElementById('level4').value;
      $scope.level5 = document.getElementById('level5').value;
      var result = ngXlsx.writeXlsx([{
       sheetName: "sheet",
       columnDefs: [{
        field: "level1",
        displayName: $scope.level1
       }, {
        field: "level2",
        displayName: $scope.level2
       }, {
        field: "level3",
        displayName: $scope.level3
       }, {
        field: "level4",
        displayName: $scope.level4
       }, {
        field: "level5",
        displayName: $scope.level5
       }, {
        field: "totalNumberOfTestCases",
        displayName: "Total Number Of Test Cases"
       }, {
        field: "manual",
        displayName: "Manual"
       }, {
        field: "automated",
        displayName: "Automated"
       },{
        field: "POC",
        displayName: "POC"
       }],
       data: []
      }]);
     }
     if ($scope.selectedItem == 'Default') {
      var result = ngXlsx.writeXlsx([{
       sheetName: "sheet",
       columnDefs: [{
         field: "asg",
         displayName: "ASG"
        }, {
         field: "application",
         displayName: "Application"
        }, {
         field: "businesscapability",
         displayName: "Business Capability"
        }, {
         field: "functionality",
         displayName: "Functionality"
        }, {
         field: "totalNumberOfTestCases",
         displayName: "Total Number Of Test Cases"
        }, {
         field: "manual",
         displayName: "Manual"
        }, {
         field: "automated",
         displayName: "Automated"
        },{
        field: "POC",
        displayName: "POC"
       }],
       data: []
      }]);
     }
     /* the saveAs call downloads a file on the local machine */
     saveAs(new Blob([s2ab(result)], {
      type: "application/octet-stream"
     }), "RegressionDataSheet.xlsx");
    }
    $scope.showAdvanced = function(ev) {
     var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
     $mdDialog.show({
       controller: DialogController,
       templateUrl: 'dialog1.tmpl.html',
       parent: angular.element(document.body),
       targetEvent: ev,
       clickOutsideToClose: true,
       fullscreen: useFullScreen
      })
      .then(function(answer) {
       $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
       $scope.status = 'You cancelled the dialog.';
      });
     $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
     }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
     });
    };

    $scope.showTabDialog = function(ev) {
     $mdDialog.show({
       controller: DialogController,
       templateUrl: 'tabDialog.tmpl.html',
       parent: angular.element(document.body),
       targetEvent: ev,
       clickOutsideToClose: true
      })
      .then(function(answer) {
       $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
       $scope.status = 'You cancelled the dialog.';
      });
    };

    $scope.seriesSelected = function(selectedItem) {
      if($rootScope.dataHeader.length >= 7){
        var col = selectedItem.row;
        $rootScope.selectedLevel1Data = $scope.chartObject.data[col + 1][0];
        $location.path("/level2Page"); 
      }
             
    }

    if($rootScope.mainPageData != null){
      loadMap();
    }

    function loadMap() {
     if ($rootScope.mainPageData != null) {
      $scope.chartObject = {};
      $scope.chartObject.type = "TreeMap";

      $scope._createSVGLabel = function(d) {
       var xmlns = "http://www.w3.org/2000/svg";
       var t = document.createElementNS(xmlns, "text");
       t.setAttributeNS(null, "fill", "#000000");
       t.setAttributeNS(null, "stroke-width", "0");
       t.setAttributeNS(null, "stroke", "none");
       t.setAttributeNS(null, "font-weight", d.fontWeight ? d.fontWeight : 'normal');
       t.setAttributeNS(null, "font-size", "16");
       t.setAttributeNS(null, "font-family", "AccentureFont");
       t.setAttributeNS(null, "y", d.y);
       t.setAttributeNS(null, "x", d.x);
       t.setAttributeNS(null, "text-anchor", "middle");
       t.textContent = d.text;
       return t;
      };

      $scope.onChartReady = function() {
       var gNodes = $("svg g");
       var n = gNodes.length;
       gNodes.each(function(i, g) {
        try {
         if (i >= n - 1)
          return;
         //Create text node and append
         //
         //Get content label node ref
         var titleText = $(g).find("text");
         //Get the data 
         var data = JSON.parse($(titleText).text());
         $(titleText).remove();
         if (data.l2.contains("0") || data.l2.contains("1") || data.l2.contains("2") || data.l2.contains("3") || data.l2.contains("4") || data.l2.contains("5") || data.l2.contains("6") || data.l2.contains("7") || data.l2.contains("8") || data.l2.contains("9")) {
          $(g).find("rect").css('fill', '#FF0000');
         }
         if (data.l2.contains("10") || data.l2.contains("11") || data.l2.contains("12") || data.l2.contains("13") || data.l2.contains("14") || data.l2.contains("15") || data.l2.contains("16") || data.l2.contains("17") || data.l2.contains("18") || data.l2.contains("19")) {
          $(g).find("rect").css('fill', '#FF3300');
         }
         if (data.l2.contains("20") || data.l2.contains("21") || data.l2.contains("22") || data.l2.contains("23") || data.l2.contains("24") || data.l2.contains("25") || data.l2.contains("26") || data.l2.contains("27") || data.l2.contains("28") || data.l2.contains("29")) {
          $(g).find("rect").css('fill', '#FF6600');
         }
         if (data.l2.contains("30") || data.l2.contains("31") || data.l2.contains("32") || data.l2.contains("33") || data.l2.contains("34") || data.l2.contains("35") || data.l2.contains("36") || data.l2.contains("37") || data.l2.contains("38") || data.l2.contains("39")) {
          $(g).find("rect").css('fill', '#FF9900');
         }
         if (data.l2.contains("40") || data.l2.contains("41") || data.l2.contains("42") || data.l2.contains("43") || data.l2.contains("44") || data.l2.contains("45") || data.l2.contains("46") || data.l2.contains("47") || data.l2.contains("48") || data.l2.contains("49")) {
          $(g).find("rect").css('fill', '#FFCC00');
         }
         if (data.l2.contains("50") || data.l2.contains("51") || data.l2.contains("52") || data.l2.contains("53") || data.l2.contains("54") || data.l2.contains("55") || data.l2.contains("56") || data.l2.contains("57") || data.l2.contains("58") || data.l2.contains("59")) {
          $(g).find("rect").css('fill', '#FFFF00');
         }
         if (data.l2.contains("60") || data.l2.contains("61") || data.l2.contains("62") || data.l2.contains("63") || data.l2.contains("64") || data.l2.contains("65") || data.l2.contains("66") || data.l2.contains("67") || data.l2.contains("68") || data.l2.contains("69")) {
          $(g).find("rect").css('fill', '#FFFF0A');
         }
         if (data.l2.contains("70") || data.l2.contains("71") || data.l2.contains("72") || data.l2.contains("73") || data.l2.contains("74") || data.l2.contains("75") || data.l2.contains("76") || data.l2.contains("77") || data.l2.contains("78") || data.l2.contains("79")) {
          $(g).find("rect").css('fill', '#C2FF14');
         }
         if (data.l2.contains("80") || data.l2.contains("81") || data.l2.contains("82") || data.l2.contains("83") || data.l2.contains("84") || data.l2.contains("85") || data.l2.contains("86") || data.l2.contains("87") || data.l2.contains("88") || data.l2.contains("89")) {
          $(g).find("rect").css('fill', '#A4FF1E');
         }
         if (data.l2.contains("90") || data.l2.contains("91") || data.l2.contains("92") || data.l2.contains("93") || data.l2.contains("94") || data.l2.contains("95") || data.l2.contains("96") || data.l2.contains("97") || data.l2.contains("98") || data.l2.contains("99")) {
          $(g).find("rect").css('fill', '#85FF28');
         }
         if (data.l2.contains("100")) {
          $(g).find("rect").css('fill', '#66FF33');
         }
         //Modify the title (increase font size, change the text...)
         //Create SVG labels
         var t = $scope._createSVGLabel({
          text: data.title,
          x: titleText.attr("x"),
          y: parseFloat(titleText.attr("y")) - 40,
          fontWeight: 'bold'
         });
         $(g).append($(t));
         t = $scope._createSVGLabel({
          text: data.l1,
          x: titleText.attr("x"),
          y: parseFloat(titleText.attr("y")) - 20
         });
         $(g).append($(t));
         t = $scope._createSVGLabel({
          text: data.l3,
          x: titleText.attr("x"),
          y: parseFloat(titleText.attr("y"))
         });
         $(g).append($(t));
         t = $scope._createSVGLabel({
          text: data.l2,
          x: titleText.attr("x"),
          y: parseFloat(titleText.attr("y")) + 20
         });
         $(g).append($(t));
         // t = $scope._createSVGLabel({
         //  text: data.l4,
         //  x: titleText.attr("x"),
         //  y: parseFloat(titleText.attr("y")) + 40
         // });
         // $(g).append($(t));
        } catch (e) {}
       })
      }
      var d = [];
      d.push(['level1', 'level2', 'Count', 'RAG'], [$rootScope.level1DataHeader, null, 0, 20]);
      for (var i = 0; i < $rootScope.mainPageData.length; i++) {
       d.push($rootScope.mainPageData[i]);
      };
      $scope.chartObject.data = d;
      $scope.chartObject.options = {
       height: 500,
       width: 600,
       minColor: '#ff0000',
       midColor: '#ffff00',
       maxColor: '#66ff33',
       fillOpacity: '0',
       headerHeight: 0.1,
       highlightOnMouseOver: true,
       textStyle: {
        color: 'black',
        bold: 'true',
        fontSize: '0.1',
        fontName: 'AccentureFont'
       }
      };
     }
    }

    function showFullTooltip(row, size, value, column) {
     return '<div style="background:lightblue; padding:10px; border-style:solid">' +
      '<span style="font-family:Arial; font-size: 11px;">' + size + '  Applications</span><br>' +
      '<span style="font-family:Arial; font-size: 11px;"> Automated: ' + $filter('number')(($scope.chartObject.data[row + 1][3]) * 100, 0) + '%' + '</span><br>' +
      ' </div>';
    }



   }
  ]);

  function s2ab(s) {
   var buf = new ArrayBuffer(s.length);
   var view = new Uint8Array(buf);
   for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
   return buf;
  }