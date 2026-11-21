package site.ayneh.pay;

import android.app.job.JobParameters;
import android.app.job.JobService;

/** Runs when the phone has internet; retries with back-off until every deposit reached the site. */
public class SendJob extends JobService {
    @Override
    public boolean onStartJob(final JobParameters params) {
        new Thread(() -> {
            boolean again = Sender.flush(getApplicationContext());
            jobFinished(params, again);
        }).start();
        return true;
    }

    @Override
    public boolean onStopJob(JobParameters params) { return true; }
}
