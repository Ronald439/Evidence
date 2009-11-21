function WebTestResult(name) {
  TestResultTree.call(this, name);
}

chain(WebTestResult, TestResultTree);
WebTestResult.displayName = 'WebTestResult';

(function(p) {
  var _super = TestResultTree.prototype;
  
  function addAssertion() {
    _super.addAssertion.call(this);
    this.gui.updateResults(this);
  }
  
  function addSkip(testcase, msg) {
    _super.addSkip.call(this, testcase, msg);
    var gui = this.gui;
    gui.updateResults(this);
    gui.setLevel(Logger.WARN);
    gui.updateStatus('Skipping testcase ' + testcase + ': ' + msg.message);
  }
  
  function addFailure(testcase, msg) {
    _super.addFailure.call(this, testcase, msg);
    var gui = this.gui;
    gui.updateResults(this);
    gui.setLevel(Logger.ERROR);
    gui.updateStatus(testcase + ': ' + msg.message + ' ' + msg.template, msg.args);
  }
  
  function addError(testcase, error) {
    _super.addError.call(this, testcase, error);
    var gui = this.gui;
    gui.updateResults(this);
    gui.setLevel(Logger.ERROR);
    gui.updateStatus(testcase + ' threw an error. ' + error);
  }
  
  function startTest(testcase) {
    _super.startTest.call(this, testcase);
    this.gui.updateStatus('Started testcase ' + testcase);
  }
  
  function stopTest(testcase) {
    _super.stopTest.call(this, testcase);
    var gui = this.gui;
    gui.updateProgressBar(this.testCount / this.size);
    gui.updateStatus('Completed testcase ' + testcase);
  }
  
  function pauseTest(testcase) {
    this.gui.updateStatus('Paused testcase ' + testcase + '...');
  }
  
  function restartTest(testcase) {
    this.gui.updateStatus('Restarted testcase ' + testcase);
  }
  
  function startSuite(suite) {
    _super.startSuite.call(this, suite);
    if (!this.size) { this.size = suite.size(); }
    this.gui.updateStatus('Started suite ' + suite);
  }
  
  function stopSuite(suite) {
    _super.stopSuite.call(this, suite);
    this.gui.updateStatus('Completed suite ' + suite);
  }
  
  function start(t0) {
    _super.start.call(this, t0);
    var gui = new WebGUI(document);
    this.gui = gui;
    document.body.appendChild(gui.build().toElement());
    gui.updateResults(this);
  }
  
  function stop(t1) {
    _super.stop.call(this, t1);
    this.gui.updateStatus('Completed tests in ' + ((t1 - this.t0)/1000) + 's');
  }
  
  p.addAssertion  = addAssertion;
  p.addSkip       = addSkip;
  p.addFailure    = addFailure;
  p.addError      = addError;
  p.startTest     = startTest;
  p.stopTest      = stopTest;
  p.pauseTest     = pauseTest;
  p.restartTest   = restartTest;
  p.startSuite    = startSuite;
  p.stopSuite     = stopSuite;
  p.start         = start;
  p.stop          = stop;
})(WebTestResult.prototype);


