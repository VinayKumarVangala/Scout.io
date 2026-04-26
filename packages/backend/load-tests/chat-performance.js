import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users
    { duration: '1m', target: 20 },  // Stay at 20 users
    { duration: '30s', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must be below 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% failure rate
  },
};

export default function () {
  const url = 'http://localhost:5000/api/chat/completions';
  const payload = JSON.stringify({
    messages: [{ role: 'user', content: 'Performance test message' }],
    userId: `user_${__VU}`,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': 'test-client-id',
      'Authorization': 'Bearer test-token',
    },
  };

  const res = http.post(url, payload, params);
  
  check(res, {
    'is status 200': (r) => r.status === 200,
    'has response content': (r) => r.json().content !== undefined,
  });

  sleep(1);
}
