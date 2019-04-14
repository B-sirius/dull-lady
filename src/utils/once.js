// 超过wait不操作才执行
export default function once(func, wait = 100) {
  let context, args, result;
  let timeout = null; // 记录setTimeout
  let previous = 0; // 上次试图调用的时间点
  let later = function () {
    result = func.apply(context, args);

    previous = Date.now(); // 真正执行，重设previous
    timeout = null; // 重设timeout
    context = args = null;
  };
  return function () {
    let now = Date.now();
    if (!previous) previous = now;
    let remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining > 0 && remaining <= wait) {
      previous = Date.now();
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    }
    return result;
  };
};