import http from 'k6/http';
import { Rate } from 'k6/metrics';
import { check } from 'k6';


let FOO = 'foo';

let rate200 = new Rate('rate_200');
let rate400 = new Rate('rate_400');
let rate5xx = new Rate('rate_5xx');
let rateOther = new Rate('rate_other');

export let errorRate = new Rate('errors');

export let options = {
    scenarios: {
      constant_request_rate: {
        executor: 'constant-arrival-rate',
        rate: 20,
        timeUnit: '1s', // 20 iterations per second, i.e. 20 RPS
        duration: '30s',
        preAllocatedVUs: 2, // how large the initial pool of VUs would be
        maxVUs: 4, // if the preAllocatedVUs are not enough, we can initialize more
      },
    },
    thresholds: {
        errors: ['rate<0.0001'], // 1/1000 % are errors
      },
  };


export default function () {
    var url = 'https://your.com';

    var payload = JSON.stringify({
        "foo": FOO,
    });

    var params = {
        headers: {
            'Content-Type': 'application/json',
            'x-foo': 'bar',
        },
    };

    let res = http.post(url, payload, params);
    let status = res.status;
    console.log(status + ': ' + res.body);

    const result = check(res, {
        'status is 200': (r) => r.status == 200,
      });
    errorRate.add(!result);
    
    if (status === 200){rate200.add(1);}
    else if (status === 400){rate400.add(1);}
    else if (status > 499){rate5xx.add(1);}
    else {rateOther.add(1);}
}
