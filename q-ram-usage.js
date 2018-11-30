// Library to track ramUsage
const si = require('systeminformation');

// Library to send signal to Q keyboards
const q = require('daskeyboard-applet');

// Color associated to ram activity from low (green), middle (yellow), to high (red).
const colors = ['#00FF00', '#33FF00','#FFFF00', '#FF6600', '#FF0000'];

const logger = q.logger;


class RamUsage extends q.DesktopApp {
  constructor() {
    super();
    this.pollingInterval = 3000; // run() every 3000 ms
    logger.info("RAM Usage Meter ready to go!");
  }

  // call this function every pollingInterval
  async run() {
    return this.getRamUsage().then(percent => {
      // return signal each 3000ms, it depends of percent value
      return new q.Signal({
        points: [this.generateColor(percent)],
        name: "RAM Usage",
        message: Math.round(percent) + "%",
        isMuted: true, // don't flash the Q button on each signal
      });
    });
  }

  async getRamUsage() {
    return new Promise((resolve) => {
      si.mem(cb => {
       // get memory and create percent
       var percent = (cb.active/cb.total)*100;
       resolve(percent);
      });

 
    })
  }

  generateColor(percent) {

    let color =[];

    switch (true){

      case percent < 30:
        // return first color
        color.push(new q.Point(colors[0]));
        break;

      case percent < 50:
        // return second color
        color.push(new q.Point(colors[1]));
        break;

      case percent < 70:
        // return third color
        color.push(new q.Point(colors[2]));
        break;
      
      case percent < 85:
        // return fourth color
        color.push(new q.Point(colors[3]));
        break;

      case percent <= 100:
        // return fifth color
        color.push(new q.Point(colors[4]));
        break;

      default:
        // Something wrong happened, percent>100, return white color
        color.push(new q.Point("#FFFFFF"));
        break;

    };


    return color;
  }

}

module.exports = {
  RamUsage: RamUsage
};

const ramUsage = new RamUsage();
