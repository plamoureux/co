System.register(["babel-runtime/core-js"], function (_export) {
  var _core, slice;

  _export("co", co);

  /**
   * Execute the generator function or a generator
   * and return a promise.
   *
   * @param {Function} fn
   * @return {Promise}
   * @api public
   */

  function co(gen) {
    var ctx = this;

    // we wrap everything in a promise to avoid promise chaining,
    // which leads to memory leak errors.
    // see https://github.com/tj/co/issues/180
    return new _core.Promise(function (resolve, reject) {
      if (typeof gen === "function") gen = gen.call(ctx);
      if (!gen || typeof gen.next !== "function") return resolve(gen);

      onFulfilled();

      /**
       * @param {Mixed} res
       * @return {Promise}
       * @api private
       */

      function onFulfilled(res) {
        var ret;
        try {
          ret = gen.next(res);
        } catch (e) {
          return reject(e);
        }
        next(ret);
      }

      /**
       * @param {Error} err
       * @return {Promise}
       * @api private
       */

      function onRejected(err) {
        var ret;
        try {
          ret = gen["throw"](err);
        } catch (e) {
          return reject(e);
        }
        next(ret);
      }

      /**
       * Get the next value in the generator,
       * return a promise.
       *
       * @param {Object} ret
       * @return {Promise}
       * @api private
       */

      function next(ret) {
        if (ret.done) {
          return resolve(ret.value);
        }var value = toPromise.call(ctx, ret.value);
        if (value && isPromise(value)) {
          return value.then(onFulfilled, onRejected);
        }return onRejected(new TypeError("You may only yield a function, promise, generator, array, or object, " + "but the following object was passed: \"" + String(ret.value) + "\""));
      }
    });
  }

  /**
   * Convert a `yield`ed value into a promise.
   *
   * @param {Mixed} obj
   * @return {Promise}
   * @api private
   */

  function toPromise(obj) {
    if (!obj) {
      return obj;
    }if (isPromise(obj)) {
      return obj;
    }if (isGeneratorFunction(obj) || isGenerator(obj)) {
      return co.call(this, obj);
    }if ("function" == typeof obj) {
      return thunkToPromise.call(this, obj);
    }if (Array.isArray(obj)) {
      return arrayToPromise.call(this, obj);
    }if (isObject(obj)) {
      return objectToPromise.call(this, obj);
    }return obj;
  }

  /**
   * Convert a thunk to a promise.
   *
   * @param {Function}
   * @return {Promise}
   * @api private
   */

  function thunkToPromise(fn) {
    var ctx = this;
    return new _core.Promise(function (resolve, reject) {
      fn.call(ctx, function (err, res) {
        if (err) return reject(err);
        if (arguments.length > 2) res = slice.call(arguments, 1);
        resolve(res);
      });
    });
  }

  /**
   * Convert an array of "yieldables" to a promise.
   * Uses `Promise.all()` internally.
   *
   * @param {Array} obj
   * @return {Promise}
   * @api private
   */

  function arrayToPromise(obj) {
    return _core.Promise.all(obj.map(toPromise, this));
  }

  /**
   * Convert an object of "yieldables" to a promise.
   * Uses `Promise.all()` internally.
   *
   * @param {Object} obj
   * @return {Promise}
   * @api private
   */

  function objectToPromise(obj) {
    var results = new obj.constructor();
    var keys = _core.Object.keys(obj);
    var promises = [];
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var promise = toPromise.call(this, obj[key]);
      if (promise && isPromise(promise)) defer(promise, key);else results[key] = obj[key];
    }
    return _core.Promise.all(promises).then(function () {
      return results;
    });

    function defer(promise, key) {
      // predefine the key in the result
      results[key] = undefined;
      promises.push(promise.then(function (res) {
        results[key] = res;
      }));
    }
  }

  /**
   * Check if `obj` is a promise.
   *
   * @param {Object} obj
   * @return {Boolean}
   * @api private
   */

  function isPromise(obj) {
    return "function" == typeof obj.then;
  }

  /**
   * Check if `obj` is a generator.
   *
   * @param {Mixed} obj
   * @return {Boolean}
   * @api private
   */

  function isGenerator(obj) {
    return "function" == typeof obj.next && "function" == typeof obj["throw"];
  }

  /**
   * Check if `obj` is a generator function.
   *
   * @param {Mixed} obj
   * @return {Boolean}
   * @api private
   */
  function isGeneratorFunction(obj) {
    var constructor = obj.constructor;
    if (!constructor) {
      return false;
    }if ("GeneratorFunction" === constructor.name || "GeneratorFunction" === constructor.displayName) {
      return true;
    }return isGenerator(constructor.prototype);
  }

  /**
   * Check for plain object.
   *
   * @param {Mixed} val
   * @return {Boolean}
   * @api private
   */

  function isObject(val) {
    return Object == val.constructor;
  }
  return {
    setters: [function (_babelRuntimeCoreJs) {
      _core = _babelRuntimeCoreJs["default"];
    }],
    execute: function () {
      "use strict";

      /**
       * slice() reference.
       */

      slice = Array.prototype.slice;

      /**
       * Wrap the given generator `fn` into a
       * function that returns a promise.
       * This is a separate function so that
       * every `co()` call doesn't create a new,
       * unnecessary closure.
       *
       * @param {GeneratorFunction} fn
       * @return {Function}
       * @api public
       */

      co.wrap = function (fn) {
        createPromise.__generatorFunction__ = fn;
        return createPromise;
        function createPromise() {
          return co.call(this, fn.apply(this, arguments));
        }
      };
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7YUFLSSxLQUFLOztnQkErQk8sRUFBRTs7Ozs7Ozs7Ozs7QUFBWCxXQUFTLEVBQUUsQ0FBQyxHQUFHLEVBQUU7QUFDdEIsUUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDOzs7OztBQUtmLFdBQU8sVUFBSSxPQUFPLENBQUMsVUFBUyxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQzNDLFVBQUksT0FBTyxHQUFHLEtBQUssVUFBVSxFQUFFLEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25ELFVBQUksQ0FBQyxHQUFHLElBQUksT0FBTyxHQUFHLENBQUMsSUFBSSxLQUFLLFVBQVUsRUFBRSxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFaEUsaUJBQVcsRUFBRSxDQUFDOzs7Ozs7OztBQVFkLGVBQVMsV0FBVyxDQUFDLEdBQUcsRUFBRTtBQUN4QixZQUFJLEdBQUcsQ0FBQztBQUNSLFlBQUk7QUFDRixhQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNyQixDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YsaUJBQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xCO0FBQ0QsWUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ1g7Ozs7Ozs7O0FBUUQsZUFBUyxVQUFVLENBQUMsR0FBRyxFQUFFO0FBQ3ZCLFlBQUksR0FBRyxDQUFDO0FBQ1IsWUFBSTtBQUNGLGFBQUcsR0FBRyxHQUFHLFNBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN0QixDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YsaUJBQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xCO0FBQ0QsWUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ1g7Ozs7Ozs7Ozs7O0FBV0QsZUFBUyxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQ2pCLFlBQUksR0FBRyxDQUFDLElBQUk7QUFBRSxpQkFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQUEsQUFDeEMsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNDLFlBQUksS0FBSyxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUM7QUFBRSxpQkFBTyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQztTQUFBLEFBQzFFLE9BQU8sVUFBVSxDQUFDLElBQUksU0FBUyxDQUFDLHVFQUF1RSxHQUNuRyx5Q0FBd0MsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUcsQ0FBQyxDQUFDLENBQUM7T0FDMUU7S0FDRixDQUFDLENBQUM7R0FDSjs7Ozs7Ozs7OztBQVVELFdBQVMsU0FBUyxDQUFDLEdBQUcsRUFBRTtBQUN0QixRQUFJLENBQUMsR0FBRztBQUFFLGFBQU8sR0FBRyxDQUFDO0tBQUEsQUFDckIsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDO0FBQUUsYUFBTyxHQUFHLENBQUM7S0FBQSxBQUMvQixJQUFJLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUM7QUFBRSxhQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQUEsQUFDNUUsSUFBSSxVQUFVLElBQUksT0FBTyxHQUFHO0FBQUUsYUFBTyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztLQUFBLEFBQ3BFLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFBRSxhQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQUEsQUFDOUQsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDO0FBQUUsYUFBTyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztLQUFBLEFBQzFELE9BQU8sR0FBRyxDQUFDO0dBQ1o7Ozs7Ozs7Ozs7QUFVRCxXQUFTLGNBQWMsQ0FBQyxFQUFFLEVBQUU7QUFDMUIsUUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2YsV0FBTyxVQUFJLE9BQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDNUMsUUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxHQUFHLEVBQUUsR0FBRyxFQUFFO0FBQy9CLFlBQUksR0FBRyxFQUFFLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLFlBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pELGVBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUNkLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKOzs7Ozs7Ozs7OztBQVdELFdBQVMsY0FBYyxDQUFDLEdBQUcsRUFBRTtBQUMzQixXQUFPLE1BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQzlDOzs7Ozs7Ozs7OztBQVdELFdBQVMsZUFBZSxDQUFDLEdBQUcsRUFBQztBQUMzQixRQUFJLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNwQyxRQUFJLElBQUksR0FBRyxNQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUIsUUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3BDLFVBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixVQUFJLE9BQU8sR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM3QyxVQUFJLE9BQU8sSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxLQUNsRCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQzlCO0FBQ0QsV0FBTyxNQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVk7QUFDNUMsYUFBTyxPQUFPLENBQUM7S0FDaEIsQ0FBQyxDQUFDOztBQUVILGFBQVMsS0FBSyxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7O0FBRTNCLGFBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUM7QUFDekIsY0FBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFO0FBQ3hDLGVBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7T0FDcEIsQ0FBQyxDQUFDLENBQUM7S0FDTDtHQUNGOzs7Ozs7Ozs7O0FBVUQsV0FBUyxTQUFTLENBQUMsR0FBRyxFQUFFO0FBQ3RCLFdBQU8sVUFBVSxJQUFJLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQztHQUN0Qzs7Ozs7Ozs7OztBQVVELFdBQVMsV0FBVyxDQUFDLEdBQUcsRUFBRTtBQUN4QixXQUFPLFVBQVUsSUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJLElBQUksVUFBVSxJQUFJLE9BQU8sR0FBRyxTQUFNLENBQUM7R0FDeEU7Ozs7Ozs7OztBQVNELFdBQVMsbUJBQW1CLENBQUMsR0FBRyxFQUFFO0FBQ2hDLFFBQUksV0FBVyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7QUFDbEMsUUFBSSxDQUFDLFdBQVc7QUFBRSxhQUFPLEtBQUssQ0FBQztLQUFBLEFBQy9CLElBQUksbUJBQW1CLEtBQUssV0FBVyxDQUFDLElBQUksSUFBSSxtQkFBbUIsS0FBSyxXQUFXLENBQUMsV0FBVztBQUFFLGFBQU8sSUFBSSxDQUFDO0tBQUEsQUFDN0csT0FBTyxXQUFXLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0dBQzNDOzs7Ozs7Ozs7O0FBVUQsV0FBUyxRQUFRLENBQUMsR0FBRyxFQUFFO0FBQ3JCLFdBQU8sTUFBTSxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUM7R0FDbEM7Ozs7Ozs7Ozs7OztBQWhPRyxXQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLOzs7Ozs7Ozs7Ozs7OztBQWNqQyxRQUFFLENBQUMsSUFBSSxHQUFHLFVBQVUsRUFBRSxFQUFFO0FBQ3RCLHFCQUFhLENBQUMscUJBQXFCLEdBQUcsRUFBRSxDQUFDO0FBQ3pDLGVBQU8sYUFBYSxDQUFDO0FBQ3JCLGlCQUFTLGFBQWEsR0FBRztBQUN2QixpQkFBTyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1NBQ2pEO09BQ0YsQ0FBQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBzbGljZSgpIHJlZmVyZW5jZS5cbiAqL1xuXG52YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbi8qKlxuICogV3JhcCB0aGUgZ2l2ZW4gZ2VuZXJhdG9yIGBmbmAgaW50byBhXG4gKiBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlLlxuICogVGhpcyBpcyBhIHNlcGFyYXRlIGZ1bmN0aW9uIHNvIHRoYXRcbiAqIGV2ZXJ5IGBjbygpYCBjYWxsIGRvZXNuJ3QgY3JlYXRlIGEgbmV3LFxuICogdW5uZWNlc3NhcnkgY2xvc3VyZS5cbiAqXG4gKiBAcGFyYW0ge0dlbmVyYXRvckZ1bmN0aW9ufSBmblxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmNvLndyYXAgPSBmdW5jdGlvbiAoZm4pIHtcbiAgY3JlYXRlUHJvbWlzZS5fX2dlbmVyYXRvckZ1bmN0aW9uX18gPSBmbjtcbiAgcmV0dXJuIGNyZWF0ZVByb21pc2U7XG4gIGZ1bmN0aW9uIGNyZWF0ZVByb21pc2UoKSB7XG4gICAgcmV0dXJuIGNvLmNhbGwodGhpcywgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH1cbn07XG5cbi8qKlxuICogRXhlY3V0ZSB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uIG9yIGEgZ2VuZXJhdG9yXG4gKiBhbmQgcmV0dXJuIGEgcHJvbWlzZS5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UHJvbWlzZX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGNvKGdlbikge1xuICB2YXIgY3R4ID0gdGhpcztcblxuICAvLyB3ZSB3cmFwIGV2ZXJ5dGhpbmcgaW4gYSBwcm9taXNlIHRvIGF2b2lkIHByb21pc2UgY2hhaW5pbmcsXG4gIC8vIHdoaWNoIGxlYWRzIHRvIG1lbW9yeSBsZWFrIGVycm9ycy5cbiAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS90ai9jby9pc3N1ZXMvMTgwXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICBpZiAodHlwZW9mIGdlbiA9PT0gJ2Z1bmN0aW9uJykgZ2VuID0gZ2VuLmNhbGwoY3R4KTtcbiAgICBpZiAoIWdlbiB8fCB0eXBlb2YgZ2VuLm5leHQgIT09ICdmdW5jdGlvbicpIHJldHVybiByZXNvbHZlKGdlbik7XG5cbiAgICBvbkZ1bGZpbGxlZCgpO1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtNaXhlZH0gcmVzXG4gICAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICAgIGZ1bmN0aW9uIG9uRnVsZmlsbGVkKHJlcykge1xuICAgICAgdmFyIHJldDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldCA9IGdlbi5uZXh0KHJlcyk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiByZWplY3QoZSk7XG4gICAgICB9XG4gICAgICBuZXh0KHJldCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtFcnJvcn0gZXJyXG4gICAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICAgIGZ1bmN0aW9uIG9uUmVqZWN0ZWQoZXJyKSB7XG4gICAgICB2YXIgcmV0O1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0ID0gZ2VuLnRocm93KGVycik7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiByZWplY3QoZSk7XG4gICAgICB9XG4gICAgICBuZXh0KHJldCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBuZXh0IHZhbHVlIGluIHRoZSBnZW5lcmF0b3IsXG4gICAgICogcmV0dXJuIGEgcHJvbWlzZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXRcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgZnVuY3Rpb24gbmV4dChyZXQpIHtcbiAgICAgIGlmIChyZXQuZG9uZSkgcmV0dXJuIHJlc29sdmUocmV0LnZhbHVlKTtcbiAgICAgIHZhciB2YWx1ZSA9IHRvUHJvbWlzZS5jYWxsKGN0eCwgcmV0LnZhbHVlKTtcbiAgICAgIGlmICh2YWx1ZSAmJiBpc1Byb21pc2UodmFsdWUpKSByZXR1cm4gdmFsdWUudGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCk7XG4gICAgICByZXR1cm4gb25SZWplY3RlZChuZXcgVHlwZUVycm9yKCdZb3UgbWF5IG9ubHkgeWllbGQgYSBmdW5jdGlvbiwgcHJvbWlzZSwgZ2VuZXJhdG9yLCBhcnJheSwgb3Igb2JqZWN0LCAnXG4gICAgICAgICsgJ2J1dCB0aGUgZm9sbG93aW5nIG9iamVjdCB3YXMgcGFzc2VkOiBcIicgKyBTdHJpbmcocmV0LnZhbHVlKSArICdcIicpKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIENvbnZlcnQgYSBgeWllbGRgZWQgdmFsdWUgaW50byBhIHByb21pc2UuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gb2JqXG4gKiBAcmV0dXJuIHtQcm9taXNlfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gdG9Qcm9taXNlKG9iaikge1xuICBpZiAoIW9iaikgcmV0dXJuIG9iajtcbiAgaWYgKGlzUHJvbWlzZShvYmopKSByZXR1cm4gb2JqO1xuICBpZiAoaXNHZW5lcmF0b3JGdW5jdGlvbihvYmopIHx8IGlzR2VuZXJhdG9yKG9iaikpIHJldHVybiBjby5jYWxsKHRoaXMsIG9iaik7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBvYmopIHJldHVybiB0aHVua1RvUHJvbWlzZS5jYWxsKHRoaXMsIG9iaik7XG4gIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHJldHVybiBhcnJheVRvUHJvbWlzZS5jYWxsKHRoaXMsIG9iaik7XG4gIGlmIChpc09iamVjdChvYmopKSByZXR1cm4gb2JqZWN0VG9Qcm9taXNlLmNhbGwodGhpcywgb2JqKTtcbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgdGh1bmsgdG8gYSBwcm9taXNlLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259XG4gKiBAcmV0dXJuIHtQcm9taXNlfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gdGh1bmtUb1Byb21pc2UoZm4pIHtcbiAgdmFyIGN0eCA9IHRoaXM7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgZm4uY2FsbChjdHgsIGZ1bmN0aW9uIChlcnIsIHJlcykge1xuICAgICAgaWYgKGVycikgcmV0dXJuIHJlamVjdChlcnIpO1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSByZXMgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICByZXNvbHZlKHJlcyk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG4vKipcbiAqIENvbnZlcnQgYW4gYXJyYXkgb2YgXCJ5aWVsZGFibGVzXCIgdG8gYSBwcm9taXNlLlxuICogVXNlcyBgUHJvbWlzZS5hbGwoKWAgaW50ZXJuYWxseS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBvYmpcbiAqIEByZXR1cm4ge1Byb21pc2V9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBhcnJheVRvUHJvbWlzZShvYmopIHtcbiAgcmV0dXJuIFByb21pc2UuYWxsKG9iai5tYXAodG9Qcm9taXNlLCB0aGlzKSk7XG59XG5cbi8qKlxuICogQ29udmVydCBhbiBvYmplY3Qgb2YgXCJ5aWVsZGFibGVzXCIgdG8gYSBwcm9taXNlLlxuICogVXNlcyBgUHJvbWlzZS5hbGwoKWAgaW50ZXJuYWxseS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtQcm9taXNlfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gb2JqZWN0VG9Qcm9taXNlKG9iail7XG4gIHZhciByZXN1bHRzID0gbmV3IG9iai5jb25zdHJ1Y3RvcigpO1xuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG4gIHZhciBwcm9taXNlcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICB2YXIgcHJvbWlzZSA9IHRvUHJvbWlzZS5jYWxsKHRoaXMsIG9ialtrZXldKTtcbiAgICBpZiAocHJvbWlzZSAmJiBpc1Byb21pc2UocHJvbWlzZSkpIGRlZmVyKHByb21pc2UsIGtleSk7XG4gICAgZWxzZSByZXN1bHRzW2tleV0gPSBvYmpba2V5XTtcbiAgfVxuICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9KTtcblxuICBmdW5jdGlvbiBkZWZlcihwcm9taXNlLCBrZXkpIHtcbiAgICAvLyBwcmVkZWZpbmUgdGhlIGtleSBpbiB0aGUgcmVzdWx0XG4gICAgcmVzdWx0c1trZXldID0gdW5kZWZpbmVkO1xuICAgIHByb21pc2VzLnB1c2gocHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIHJlc3VsdHNba2V5XSA9IHJlcztcbiAgICB9KSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDaGVjayBpZiBgb2JqYCBpcyBhIHByb21pc2UuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzUHJvbWlzZShvYmopIHtcbiAgcmV0dXJuICdmdW5jdGlvbicgPT0gdHlwZW9mIG9iai50aGVuO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIGBvYmpgIGlzIGEgZ2VuZXJhdG9yLlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzR2VuZXJhdG9yKG9iaikge1xuICByZXR1cm4gJ2Z1bmN0aW9uJyA9PSB0eXBlb2Ygb2JqLm5leHQgJiYgJ2Z1bmN0aW9uJyA9PSB0eXBlb2Ygb2JqLnRocm93O1xufVxuXG4vKipcbiAqIENoZWNrIGlmIGBvYmpgIGlzIGEgZ2VuZXJhdG9yIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBpc0dlbmVyYXRvckZ1bmN0aW9uKG9iaikge1xuICB2YXIgY29uc3RydWN0b3IgPSBvYmouY29uc3RydWN0b3I7XG4gIGlmICghY29uc3RydWN0b3IpIHJldHVybiBmYWxzZTtcbiAgaWYgKCdHZW5lcmF0b3JGdW5jdGlvbicgPT09IGNvbnN0cnVjdG9yLm5hbWUgfHwgJ0dlbmVyYXRvckZ1bmN0aW9uJyA9PT0gY29uc3RydWN0b3IuZGlzcGxheU5hbWUpIHJldHVybiB0cnVlO1xuICByZXR1cm4gaXNHZW5lcmF0b3IoY29uc3RydWN0b3IucHJvdG90eXBlKTtcbn1cblxuLyoqXG4gKiBDaGVjayBmb3IgcGxhaW4gb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbCkge1xuICByZXR1cm4gT2JqZWN0ID09IHZhbC5jb25zdHJ1Y3Rvcjtcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==