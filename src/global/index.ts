import { PrototypeHelper } from "utils/PrototypeHelper";
import { StackAnalysis } from "utils/StackAnalysis";
import { RoomPositionExtension } from "./protos/roomPosition";
import { CreepExtension } from "./protos/creep";
import { RoomExtension } from "./protos/room";
import { SourceExtension } from "./protos/source";
import { MineralExtension } from "./protos/mineral";
import { StructureControllerExtension } from "./protos/controller";
import { RoomObjectExtension } from "./protos/roomObject";
import { StructureStorageExtension } from "./protos/storage";


export function mountGlobal() {

  try {
    global.LOCAL_SHARD_NAME = Game.shard.name
  } catch (e) {
    global.LOCAL_SHARD_NAME = 'sim'
  }

  global.StackAnalysis = StackAnalysis
  global.HelperCpuUsed = HelperCpuUsed;

  PrototypeHelper.assignPrototype(RoomPosition, RoomPositionExtension)
  PrototypeHelper.assignPrototype(Creep, CreepExtension)
  PrototypeHelper.assignPrototype(Room, RoomExtension)
  PrototypeHelper.assignPrototype(RoomObject, RoomObjectExtension)
  PrototypeHelper.assignPrototype(Source, SourceExtension)
  PrototypeHelper.assignPrototype(Mineral, MineralExtension)
  PrototypeHelper.assignPrototype(StructureStorage, StructureStorageExtension)
  PrototypeHelper.assignPrototype(StructureController, StructureControllerExtension)
}










/**
 *
 * HelperCpuUsed.show()
 *
 *
 */
const cpuEcharts = (divName: number, data: number[], data2: number[]) => {
  return `
<div id="${divName}" style="height: 400px;width:1200px;color:#000"/>
<script>
eval($.ajax({url:"https://cdnjs.cloudflare.com/ajax/libs/echarts/5.4.2/echarts.min.js",async:false}).responseText);
function showCpuUsed(divName,data,data2){
var chartDom = document.getElementById(divName);
var myChart = echarts.init(chartDom, 'dark');

data = data.map(e=>e>0?Number(e.toFixed(3)):0);
if(data[0]>data[data.length-1]*1.3){
    data = data.slice(1);
    data2 = data2.slice(1);
}

var option = {
  xAxis: {
    type: 'category'
  },
  yAxis: {
    type: 'value'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      animation: false
    }
  },
  yAxis: [
    {
      name: 'cpuUsed',
      type: 'value'
    },
    {
      name: 'bucket',
      max: 10000,
      min:0,
      type: 'value'
    }
  ],
  dataZoom: [
    {
      show: true
    }
  ],
  animation:false,
  series: [
    {
      data: data,
      type: 'line',
      markPoint: { data: [{ type: 'max', name: 'Max' }, { type: 'min', name: 'Min' }] },
      markLine: { data: [{ type: 'average', name: 'Avg' }] }
    },
    {
      data: data2,
      yAxisIndex: 1,
      type: 'line'
    }
  ],
  visualMap: {
    show: true,
    type: 'continuous',
    inRange: {
      color: ['#0074C5', '#0096CF', '#00B2C1', '#45CAAA', '#A1DC98',
						  '#ECE99B', '#F0CA79', '#F3A963', '#F3855B', '#ED5F5F'],
      symbolSize: [1, 10]
    },
    seriesIndex: 0,
    min: 0,
    max: ${Game.cpu.limit}
  },
};

option.backgroundColor= '#2b2b2b';
myChart.setOption(option);
};
var data = ${JSON.stringify(data)};
var data2 = ${JSON.stringify(data2)};
showCpuUsed('${divName}',data,data2)
</script>
`.replace(/[\r\n]/g, '');
  // .replace("script>","c>")
};
// smooth: true,
// step: 'middle',

let HelperCpuUsed: { cpu: number[], bucket: number[], show: () => void, exec: () => void } = {
  cpu: [],
  bucket: [],
  show() {
    console.log(cpuEcharts(Game.time, this.cpu.slice(-10000), this.bucket.slice(-10000)));
  },
  exec() {
    if (this.cpu.length > 20000) this.cpu = this.cpu.slice(-10000);
    if (this.bucket.length > 20000) this.bucket = this.bucket.slice(-10000);
    this.cpu.push(Math.ceil(Game.cpu.getUsed()));
    this.bucket.push(Game.cpu.bucket);
  }
};


