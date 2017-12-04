/**
 * This file defines the life cycle hooks for the Integration Service JS
 */

 // define and null any polling objects here as needed
 
/**
 * This is the method called when the Integration Agent starts
 * this Integration Service.
 * 
 * For the polling engine integration we will start the thread which periodically
 * checks TBD but initially just writes a log entry.
 */
function apia_startup()
{
  IALOG.info(LOGGING_PREFIX + "Entered Startup Hook.");
  pollingThread = spawn(polling_method);
  return true;
}

/**
 * This is the method called when the Integration Agent shut down
 * this Integration Service.
 * 
 * For the Polling Engine integration we will stop the thread which makes periodically
 * checks the TBD but initially just writes a log entry.
 */
function apia_shutdown()
{
  IALOG.info(LOGGING_PREFIX + "Entered Shutdown Hook.");
  shouldContinuePolling = false;
  keepPollThreadAlive = false;
  return true;
}

/**
 * This is the method called when the Integration Agent suspends
 * this Integration Service. For example when the below command is executed.
 * <p>
 */
function apia_suspend()
{
  IALOG.info(LOGGING_PREFIX + "Entered Suspend Hook.");
  shouldContinuePolling = false;
  apia_interrupt();
  return true;
}

/**
 * This is the method called when the Integration Agent resumes
 * this Integration Service. 
 * <p>
 */
function apia_resume()
{
  IALOG.info(LOGGING_PREFIX + "Entered Resume Hook.");
  shouldContinuePolling = true;
  return true;
}

/**
 * This is the method called when the Integration Agent interrupts
 * this Integration Service. 
 * <p>
 */
function apia_interrupt()
{
  IALOG.info(LOGGING_PREFIX + "Entered Interrupt Hook.");
  if (pollingThread != null)
  {
    pollingThread.interrupt();
  }
  return true;
}
