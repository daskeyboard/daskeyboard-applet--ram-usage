// Library to track ramUsage
const si = require('systeminformation');

// Library to send signal to Q keyboards
const q = require('daskeyboard-applet');

// Color associated to ram activity from low (green), middle (yellow), to high (red).
const colors = ['#00FF00', '#FFFF00', '#FF0000'];

const logger = q.logger;


class RamUsage extends q.DesktopApp {
  constructor() {
    super();
    // run every 3000 ms
    this.pollingInterval = 3000;
    logger.info("RAM Usage Meter ready to go!");
  }

  // call this function every pollingInterval
  async run() {
    return this.getRamUsage().then(percent => {
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
       var percent = (cb.active/cb.total)*100;
       resolve(percent);
      });

 
    })
  }

  generateColor(percent) {

    let color =[];
    console.log(percent);

    switch (true){

      case percent < 60:
        color.push(new q.Point(colors[0]));
        break;
      
      case percent < 80:
        color.push(new q.Point(colors[1]));
        break;

      case percent <= 100:
        color.push(new q.Point(colors[2]));
        break;

      default:
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
