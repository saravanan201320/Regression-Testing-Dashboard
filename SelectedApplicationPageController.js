var SelectedApplicationPageControllers = angular.module('SelectedApplicationPageControllers',['googlechart','angular.filter']);
SelectedApplicationPageControllers.controller('SelectedApplicationPageController', function($scope,$http,$filter,$rootScope,$location){
	if(typeof($rootScope.groups) == "string"){
    var jsonData = JSON.parse($rootScope.groups);
  }
  else {
    var jsonData = $rootScope.groups;
  }
  if(typeof($rootScope.selectedLevel2Data) == "string"){  	
    $rootScope.selectedLevel2Data = JSON.parse($rootScope.selectedLevel2Data);
  }  
  var dataHeader = $rootScope.dataHeader;

  $scope.backBtn = function(){
    $location.path("/level2Page");
  }

  
  var selectedLevel2Header = "";
  var selectedLevel2Header =  $rootScope.selectedLevel2Data.title;
  $rootScope.selectedLevel2Header = $rootScope.selectedLevel2Data.title
  $scope.level3Data =[]
  $scope.level3PageData = [];
  for (var i = 0; i < jsonData.length; i++){    
    if(jsonData[i][dataHeader[0]] == $rootScope.selectedHeader && jsonData[i][dataHeader[1]] == selectedLevel2Header){
      $scope.level3Data.push(jsonData[i][dataHeader[2]]);               
    }
  }
  $scope.level3Data = $filter('unique')($scope.level3Data);        
  console.log("level3Data"+$scope.level3Data);
  
  for(var j=0; j< $scope.level3Data.length; j++){       
    $scope.level4Data = [];
    $scope.POC = [];
    $scope.totalNumberOfTestCases = 0;
    $scope.automatedCount = 0;
    $scope.manualCount = 0;
    $scope.automated = 0;       
    for (var k = 0; k < jsonData.length; k++){                   
      if(jsonData[k][dataHeader[2]] == $scope.level3Data[j] && jsonData[k][dataHeader[0]] == $rootScope.selectedHeader && jsonData[k][dataHeader[1]] == selectedLevel2Header){          
        $scope.level4Data.push(jsonData[k][dataHeader[3]]); 
        if (dataHeader.length == 7){
          $scope.totalNumberOfTestCases = parseInt(jsonData[k][dataHeader[3]]) + $scope.totalNumberOfTestCases;
          $scope.automatedCount = parseInt(jsonData[k][dataHeader[4]]) + $scope.automatedCount;
          $scope.manualCount = parseInt(jsonData[k][dataHeader[5]]) + $scope.manualCount;
          $scope.POC.push(jsonData[k][dataHeader[6]]);
        }         
        if (dataHeader.length == 8){
        $scope.totalNumberOfTestCases = parseInt(jsonData[k][dataHeader[4]]) + $scope.totalNumberOfTestCases;
        $scope.automatedCount = parseInt(jsonData[k][dataHeader[5]]) + $scope.automatedCount;
        $scope.manualCount = parseInt(jsonData[k][dataHeader[6]]) + $scope.manualCount;
        $scope.POC.push(jsonData[k][dataHeader[7]]);
        }
        if (dataHeader.length == 9){
          $scope.totalNumberOfTestCases = parseInt(jsonData[k][dataHeader[5]]) + $scope.totalNumberOfTestCases;
          $scope.automatedCount = parseInt(jsonData[k][dataHeader[6]]) + $scope.automatedCount;
          $scope.manualCount = parseInt(jsonData[k][dataHeader[7]]) + $scope.manualCount;
          $scope.POC.push(jsonData[k][dataHeader[8]]);
        }
      }
    }
    if($scope.totalNumberOfTestCases == 0 || $scope.totalNumberOfTestCases == 'Nan'){
      $scope.totalNumberOfTestCases = 0;
    }
    if($scope.automatedCount == 0 || $scope.automatedCount == 'Nan'){
      $scope.automatedCount = 0;
    }
    if($scope.manualCount == 0 || $scope.manualCount == 'Nan'){
      $scope.manualCount = 0;
    }
    if($scope.totalNumberOfTestCases == 0){
      $scope.automated = 'Automated : NA';
      $scope.mapColor = 0;
    }
    else
    {
      $scope.automated = ($scope.automatedCount/$scope.totalNumberOfTestCases)*100;
      $scope.automated = $filter('number')($scope.automated, 0);
      $scope.mapColor = $scope.automated;
    }
    // if(x==0 || x==1 || x==2){
      $scope.level4Data = $filter('unique')($scope.level4Data);
      $scope.POC = $filter('unique')($scope.POC);
      // $scope.automated = ($scope.automatedCount / $scope.totalNumberOfTestCases) * 100;
      // $scope.automated = $filter('number')($scope.automated, 0);
      $scope.level3PageData.push([JSON.stringify({"title":$scope.level3Data[j],"l1":$scope.level4Data.length+' Functionality',"l2":$scope.automated+'% Automated', "l3":$scope.totalNumberOfTestCases+' Test Cases',"l4": "POC : "+ $scope.POC}),selectedLevel2Header,$scope.level4Data.length, $scope.mapColor]);
      console.log($scope.level3PageData);
    // }; 
    // if(x==($scope.bussinessCapability.length-1) && x!=0 && x!=1 && x!=2){          
      // $scope.FunctionalityData.push([JSON.stringify({"title":"Others","l1":$scope.functionality.length+' Functionality',"l2":$scope.BCAutomated, "l3":$scope.BCNumberOfTestCases+' Test Cases'}),Application,4, $scope.mapColor]);          
    // }    
  }
  $scope.chartObject2 = {};
  $scope.chartObject2.type = "TreeMap";
  var d = [];
   d.push(['level2', 'level1', 'Count', 'RAG'], [selectedLevel2Header, null, 0, 20]);
   for (var i = 0; i < $scope.level3PageData.length; i++) {
    d.push($scope.level3PageData[i]);
   };
   $scope.chartObject2.data = d;

$scope.chartObject2.options = {
  height: 500,
  width: 600,
  minColor: '#ff0000',
  midColor: '#ffff00',
  maxColor: '#66ff33',
  headerHeight: 0.1,
  fontColor: 'black',          
  highlightOnMouseOver: true,
  textStyle : {color: 'black', bold: 'true', fontSize: '0.1'}
};

$scope.onChartReady = function()
{  
  var gNodes = $("svg g");
  var n = gNodes.length;
  gNodes.each(function(i, g){
    try
    {      
      if(i>=n-1)
        return;
          //Create text node and append
          //
          //Get content label node ref
          var titleText = $(g).find("text");        
          //Get the data 
          var data = JSON.parse($(titleText).text());                    
          $(titleText).remove();
          if(data.l2.contains("0")||data.l2.contains("1")||data.l2.contains("2")||data.l2.contains("3")||data.l2.contains("4")
            ||data.l2.contains("5")||data.l2.contains("6")||data.l2.contains("7")||data.l2.contains("8")||data.l2.contains("9")){
            $(g).find("rect").css('fill', '#FF0000');
          }
          if(data.l2.contains("10")||data.l2.contains("11")||data.l2.contains("12")||data.l2.contains("13")||data.l2.contains("14")
            ||data.l2.contains("15")||data.l2.contains("16")||data.l2.contains("17")||data.l2.contains("18")||data.l2.contains("19")){
            $(g).find("rect").css('fill', '#FF3300');
          }
          if(data.l2.contains("20")||data.l2.contains("21")||data.l2.contains("22")||data.l2.contains("23")||data.l2.contains("24")
            ||data.l2.contains("25")||data.l2.contains("26")||data.l2.contains("27")||data.l2.contains("28")||data.l2.contains("29")){
            $(g).find("rect").css('fill', '#FF6600');
          }
          if(data.l2.contains("30")||data.l2.contains("31")||data.l2.contains("32")||data.l2.contains("33")||data.l2.contains("34")
            ||data.l2.contains("35")||data.l2.contains("36")||data.l2.contains("37")||data.l2.contains("38")||data.l2.contains("39")){
            $(g).find("rect").css('fill', '#FF9900');
          }
          if(data.l2.contains("40")||data.l2.contains("41")||data.l2.contains("42")||data.l2.contains("43")||data.l2.contains("44")
            ||data.l2.contains("45")||data.l2.contains("46")||data.l2.contains("47")||data.l2.contains("48")||data.l2.contains("49")){
            $(g).find("rect").css('fill', '#FFCC00');
          }
          if(data.l2.contains("50")||data.l2.contains("51")||data.l2.contains("52")||data.l2.contains("53")||data.l2.contains("54")
            ||data.l2.contains("55")||data.l2.contains("56")||data.l2.contains("57")||data.l2.contains("58")||data.l2.contains("59")){
            $(g).find("rect").css('fill', '#FFFF00');
          }
          if(data.l2.contains("60")||data.l2.contains("61")||data.l2.contains("62")||data.l2.contains("63")||data.l2.contains("64")
            ||data.l2.contains("65")||data.l2.contains("66")||data.l2.contains("67")||data.l2.contains("68")||data.l2.contains("69")){
            $(g).find("rect").css('fill', '#FFFF0A');
          }
          if(data.l2.contains("70")||data.l2.contains("71")||data.l2.contains("72")||data.l2.contains("73")||data.l2.contains("74")
            ||data.l2.contains("75")||data.l2.contains("76")||data.l2.contains("77")||data.l2.contains("78")||data.l2.contains("79")){
            $(g).find("rect").css('fill', '#C2FF14');
          }
          if(data.l2.contains("80")||data.l2.contains("81")||data.l2.contains("82")||data.l2.contains("83")||data.l2.contains("84")
            ||data.l2.contains("85")||data.l2.contains("86")||data.l2.contains("87")||data.l2.contains("88")||data.l2.contains("89")){
            $(g).find("rect").css('fill', '#A4FF1E');
          }
          if(data.l2.contains("90")||data.l2.contains("91")||data.l2.contains("92")||data.l2.contains("93")||data.l2.contains("94")
            ||data.l2.contains("95")||data.l2.contains("96")||data.l2.contains("97")||data.l2.contains("98")||data.l2.contains("99")){
            $(g).find("rect").css('fill', '#85FF28');
          }
          if(data.l2.contains("100")){
            $(g).find("rect").css('fill', '#66FF33');
          }
          //Modify the title (increase font size, change the text...)
          // $(titleText).text(data.title);
          // $(titleText).attr("font-size", "12");
          //Create SVG labels
          var t = $scope._createSVGLabel1({text:data.title, x:titleText.attr("x"), y:parseFloat(titleText.attr("y"))-40, fontWeight:'bold'});
          $(g).append($(t));
          t = $scope._createSVGLabel1({text:data.l1, x:titleText.attr("x"), y:parseFloat(titleText.attr("y"))-20});
          $(g).append($(t));
          t= $scope._createSVGLabel1({text:data.l3, x:titleText.attr("x"), y:parseFloat(titleText.attr("y"))});
          $(g).append($(t));
          t = $scope._createSVGLabel1({text:data.l2, x:titleText.attr("x"), y:parseFloat(titleText.attr("y"))+20});
          $(g).append($(t));    
          t = $scope._createSVGLabel1({text:data.l4, x:titleText.attr("x"), y:parseFloat(titleText.attr("y"))+40});
          $(g).append($(t));        
        }
        catch(e)
        {
          
        }          
      })
}
$scope._createSVGLabel1 = function (d)
{
  var xmlns = "http://www.w3.org/2000/svg";
  var t = document.createElementNS(xmlns,"text");
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

$scope.seriesSelected = function(selectedItem) {
  if($rootScope.dataHeader.length == 9){
    var col = selectedItem.row;
    $rootScope.selectedLevel3Data = $scope.chartObject2.data[col + 1][0];
    $location.path("/level4Page");
  }    
}

});