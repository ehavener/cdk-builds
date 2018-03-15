/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/cdk/platform'), require('@angular/core'), require('rxjs/observable/empty'), require('rxjs/Subject'), require('rxjs/observable/fromEvent'), require('rxjs/operators/auditTime'), require('rxjs/operators/takeUntil')) :
	typeof define === 'function' && define.amd ? define('@angular/cdk/textField', ['exports', '@angular/cdk/platform', '@angular/core', 'rxjs/observable/empty', 'rxjs/Subject', 'rxjs/observable/fromEvent', 'rxjs/operators/auditTime', 'rxjs/operators/takeUntil'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.cdk = global.ng.cdk || {}, global.ng.cdk.textField = {}),global.ng.cdk.platform,global.ng.core,global.Rx.Observable,global.Rx,global.Rx.Observable,global.Rx.operators,global.Rx.operators));
}(this, (function (exports,platform,core,empty,Subject,fromEvent,auditTime,takeUntil) { 'use strict';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Options to pass to the animationstart listener.
 */
var /** @type {?} */ listenerOptions = platform.supportsPassiveEventListeners() ? { passive: true } : false;
/**
 * An injectable service that can be used to monitor the autofill state of an input.
 * Based on the following blog post:
 * https://medium.com/\@brunn/detecting-autofilled-fields-in-javascript-aed598d25da7
 */
var AutofillMonitor = /** @class */ (function () {
    function AutofillMonitor(_platform) {
        this._platform = _platform;
        this._monitoredElements = new Map();
    }
    /**
     * Monitor for changes in the autofill state of the given input element.
     * @param element The element to monitor.
     * @return A stream of autofill state changes.
     */
    /**
     * Monitor for changes in the autofill state of the given input element.
     * @param {?} element The element to monitor.
     * @return {?} A stream of autofill state changes.
     */
    AutofillMonitor.prototype.monitor = /**
     * Monitor for changes in the autofill state of the given input element.
     * @param {?} element The element to monitor.
     * @return {?} A stream of autofill state changes.
     */
    function (element) {
        if (!this._platform.isBrowser) {
            return empty.empty();
        }
        var /** @type {?} */ info = this._monitoredElements.get(element);
        if (info) {
            return info.subject.asObservable();
        }
        var /** @type {?} */ result = new Subject.Subject();
        var /** @type {?} */ listener = function (event) {
            if (event.animationName === 'cdk-text-field-autofill-start') {
                element.classList.add('cdk-text-field-autofilled');
                result.next({ target: /** @type {?} */ (event.target), isAutofilled: true });
            }
            else if (event.animationName === 'cdk-text-field-autofill-end') {
                element.classList.remove('cdk-text-field-autofilled');
                result.next({ target: /** @type {?} */ (event.target), isAutofilled: false });
            }
        };
        element.addEventListener('animationstart', listener, listenerOptions);
        element.classList.add('cdk-text-field-autofill-monitored');
        this._monitoredElements.set(element, {
            subject: result,
            unlisten: function () {
                element.removeEventListener('animationstart', listener, listenerOptions);
            }
        });
        return result.asObservable();
    };
    /**
     * Stop monitoring the autofill state of the given input element.
     * @param element The element to stop monitoring.
     */
    /**
     * Stop monitoring the autofill state of the given input element.
     * @param {?} element The element to stop monitoring.
     * @return {?}
     */
    AutofillMonitor.prototype.stopMonitoring = /**
     * Stop monitoring the autofill state of the given input element.
     * @param {?} element The element to stop monitoring.
     * @return {?}
     */
    function (element) {
        var /** @type {?} */ info = this._monitoredElements.get(element);
        if (info) {
            info.unlisten();
            info.subject.complete();
            element.classList.remove('cdk-text-field-autofill-monitored');
            element.classList.remove('cdk-text-field-autofilled');
            this._monitoredElements.delete(element);
        }
    };
    /**
     * @return {?}
     */
    AutofillMonitor.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this._monitoredElements.forEach(function (_info, element) { return _this.stopMonitoring(element); });
    };
    AutofillMonitor.decorators = [
        { type: core.Injectable },
    ];
    /** @nocollapse */
    AutofillMonitor.ctorParameters = function () { return [
        { type: platform.Platform, },
    ]; };
    return AutofillMonitor;
}());
/**
 * A directive that can be used to monitor the autofill state of an input.
 */
var CdkAutofill = /** @class */ (function () {
    function CdkAutofill(_elementRef, _autofillMonitor) {
        this._elementRef = _elementRef;
        this._autofillMonitor = _autofillMonitor;
        this.cdkAutofill = new core.EventEmitter();
    }
    /**
     * @return {?}
     */
    CdkAutofill.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this._autofillMonitor
            .monitor(this._elementRef.nativeElement)
            .subscribe(function (event) { return _this.cdkAutofill.emit(event); });
    };
    /**
     * @return {?}
     */
    CdkAutofill.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement);
    };
    CdkAutofill.decorators = [
        { type: core.Directive, args: [{
                    selector: '[cdkAutofill]',
                },] },
    ];
    /** @nocollapse */
    CdkAutofill.ctorParameters = function () { return [
        { type: core.ElementRef, },
        { type: AutofillMonitor, },
    ]; };
    CdkAutofill.propDecorators = {
        "cdkAutofill": [{ type: core.Output },],
    };
    return CdkAutofill;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Directive to automatically resize a textarea to fit its content.
 */
var CdkTextareaAutosize = /** @class */ (function () {
    function CdkTextareaAutosize(_elementRef, _platform, _ngZone) {
        this._elementRef = _elementRef;
        this._platform = _platform;
        this._ngZone = _ngZone;
        this._destroyed = new Subject.Subject();
    }
    Object.defineProperty(CdkTextareaAutosize.prototype, "minRows", {
        get: /**
         * @return {?}
         */
        function () { return this._minRows; },
        set: /**
         * Minimum amount of rows in the textarea.
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._minRows = value;
            this._setMinHeight();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkTextareaAutosize.prototype, "maxRows", {
        get: /**
         * Maximum amount of rows in the textarea.
         * @return {?}
         */
        function () { return this._maxRows; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._maxRows = value;
            this._setMaxHeight();
        },
        enumerable: true,
        configurable: true
    });
    // TODO(crisbeto): make the `_ngZone` a required param in the next major version.
    /** Sets the minimum height of the textarea as determined by minRows. */
    /**
     * Sets the minimum height of the textarea as determined by minRows.
     * @return {?}
     */
    CdkTextareaAutosize.prototype._setMinHeight = /**
     * Sets the minimum height of the textarea as determined by minRows.
     * @return {?}
     */
    function () {
        var /** @type {?} */ minHeight = this.minRows && this._cachedLineHeight ?
            this.minRows * this._cachedLineHeight + "px" : null;
        if (minHeight) {
            this._setTextareaStyle('minHeight', minHeight);
        }
    };
    /** Sets the maximum height of the textarea as determined by maxRows. */
    /**
     * Sets the maximum height of the textarea as determined by maxRows.
     * @return {?}
     */
    CdkTextareaAutosize.prototype._setMaxHeight = /**
     * Sets the maximum height of the textarea as determined by maxRows.
     * @return {?}
     */
    function () {
        var /** @type {?} */ maxHeight = this.maxRows && this._cachedLineHeight ?
            this.maxRows * this._cachedLineHeight + "px" : null;
        if (maxHeight) {
            this._setTextareaStyle('maxHeight', maxHeight);
        }
    };
    /**
     * @return {?}
     */
    CdkTextareaAutosize.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this._platform.isBrowser) {
            this.resizeToFitContent();
            if (this._ngZone) {
                this._ngZone.runOutsideAngular(function () {
                    fromEvent.fromEvent(window, 'resize')
                        .pipe(auditTime.auditTime(16), takeUntil.takeUntil(_this._destroyed))
                        .subscribe(function () { return _this.resizeToFitContent(true); });
                });
            }
        }
    };
    /**
     * @return {?}
     */
    CdkTextareaAutosize.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._destroyed.next();
        this._destroyed.complete();
    };
    /**
     * Sets a style property on the textarea element.
     * @param {?} property
     * @param {?} value
     * @return {?}
     */
    CdkTextareaAutosize.prototype._setTextareaStyle = /**
     * Sets a style property on the textarea element.
     * @param {?} property
     * @param {?} value
     * @return {?}
     */
    function (property, value) {
        var /** @type {?} */ textarea = /** @type {?} */ (this._elementRef.nativeElement);
        textarea.style[property] = value;
    };
    /**
     * Cache the height of a single-row textarea if it has not already been cached.
     *
     * We need to know how large a single "row" of a textarea is in order to apply minRows and
     * maxRows. For the initial version, we will assume that the height of a single line in the
     * textarea does not ever change.
     * @return {?}
     */
    CdkTextareaAutosize.prototype._cacheTextareaLineHeight = /**
     * Cache the height of a single-row textarea if it has not already been cached.
     *
     * We need to know how large a single "row" of a textarea is in order to apply minRows and
     * maxRows. For the initial version, we will assume that the height of a single line in the
     * textarea does not ever change.
     * @return {?}
     */
    function () {
        if (this._cachedLineHeight) {
            return;
        }
        var /** @type {?} */ textarea = /** @type {?} */ (this._elementRef.nativeElement);
        // Use a clone element because we have to override some styles.
        var /** @type {?} */ textareaClone = /** @type {?} */ (textarea.cloneNode(false));
        textareaClone.rows = 1;
        // Use `position: absolute` so that this doesn't cause a browser layout and use
        // `visibility: hidden` so that nothing is rendered. Clear any other styles that
        // would affect the height.
        textareaClone.style.position = 'absolute';
        textareaClone.style.visibility = 'hidden';
        textareaClone.style.border = 'none';
        textareaClone.style.padding = '0';
        textareaClone.style.height = '';
        textareaClone.style.minHeight = '';
        textareaClone.style.maxHeight = '';
        // In Firefox it happens that textarea elements are always bigger than the specified amount
        // of rows. This is because Firefox tries to add extra space for the horizontal scrollbar.
        // As a workaround that removes the extra space for the scrollbar, we can just set overflow
        // to hidden. This ensures that there is no invalid calculation of the line height.
        // See Firefox bug report: https://bugzilla.mozilla.org/show_bug.cgi?id=33654
        textareaClone.style.overflow = 'hidden'; /** @type {?} */
        ((textarea.parentNode)).appendChild(textareaClone);
        this._cachedLineHeight = textareaClone.clientHeight; /** @type {?} */
        ((textarea.parentNode)).removeChild(textareaClone);
        // Min and max heights have to be re-calculated if the cached line height changes
        this._setMinHeight();
        this._setMaxHeight();
    };
    /**
     * @return {?}
     */
    CdkTextareaAutosize.prototype.ngDoCheck = /**
     * @return {?}
     */
    function () {
        if (this._platform.isBrowser) {
            this.resizeToFitContent();
        }
    };
    /**
     * Resize the textarea to fit its content.
     * @param force Whether to force a height recalculation. By default the height will be
     *    recalculated only if the value changed since the last call.
     */
    /**
     * Resize the textarea to fit its content.
     * @param {?=} force Whether to force a height recalculation. By default the height will be
     *    recalculated only if the value changed since the last call.
     * @return {?}
     */
    CdkTextareaAutosize.prototype.resizeToFitContent = /**
     * Resize the textarea to fit its content.
     * @param {?=} force Whether to force a height recalculation. By default the height will be
     *    recalculated only if the value changed since the last call.
     * @return {?}
     */
    function (force) {
        if (force === void 0) { force = false; }
        this._cacheTextareaLineHeight();
        // If we haven't determined the line-height yet, we know we're still hidden and there's no point
        // in checking the height of the textarea.
        if (!this._cachedLineHeight) {
            return;
        }
        var /** @type {?} */ textarea = /** @type {?} */ (this._elementRef.nativeElement);
        var /** @type {?} */ value = textarea.value;
        // Only resize of the value changed since these calculations can be expensive.
        if (value === this._previousValue && !force) {
            return;
        }
        var /** @type {?} */ placeholderText = textarea.placeholder;
        // Reset the textarea height to auto in order to shrink back to its default size.
        // Also temporarily force overflow:hidden, so scroll bars do not interfere with calculations.
        // Long placeholders that are wider than the textarea width may lead to a bigger scrollHeight
        // value. To ensure that the scrollHeight is not bigger than the content, the placeholders
        // need to be removed temporarily.
        textarea.style.height = 'auto';
        textarea.style.overflow = 'hidden';
        textarea.placeholder = '';
        // Use the scrollHeight to know how large the textarea *would* be if fit its entire value.
        textarea.style.height = textarea.scrollHeight + "px";
        textarea.style.overflow = '';
        textarea.placeholder = placeholderText;
        this._previousValue = value;
    };
    /**
     * @return {?}
     */
    CdkTextareaAutosize.prototype._noopInputHandler = /**
     * @return {?}
     */
    function () {
        // no-op handler that ensures we're running change detection on input events.
    };
    CdkTextareaAutosize.decorators = [
        { type: core.Directive, args: [{
                    selector: 'textarea[cdkTextareaAutosize]',
                    exportAs: 'cdkTextareaAutosize',
                    host: {
                        'class': 'cdk-textarea-autosize',
                        // Textarea elements that have the directive applied should have a single row by default.
                        // Browsers normally show two rows by default and therefore this limits the minRows binding.
                        'rows': '1',
                        '(input)': '_noopInputHandler()',
                    },
                },] },
    ];
    /** @nocollapse */
    CdkTextareaAutosize.ctorParameters = function () { return [
        { type: core.ElementRef, },
        { type: platform.Platform, },
        { type: core.NgZone, },
    ]; };
    CdkTextareaAutosize.propDecorators = {
        "minRows": [{ type: core.Input, args: ['cdkAutosizeMinRows',] },],
        "maxRows": [{ type: core.Input, args: ['cdkAutosizeMaxRows',] },],
    };
    return CdkTextareaAutosize;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var TextFieldModule = /** @class */ (function () {
    function TextFieldModule() {
    }
    TextFieldModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [CdkAutofill, CdkTextareaAutosize],
                    imports: [platform.PlatformModule],
                    exports: [CdkAutofill, CdkTextareaAutosize],
                    providers: [AutofillMonitor],
                },] },
    ];
    /** @nocollapse */
    TextFieldModule.ctorParameters = function () { return []; };
    return TextFieldModule;
}());

exports.AutofillMonitor = AutofillMonitor;
exports.CdkAutofill = CdkAutofill;
exports.CdkTextareaAutosize = CdkTextareaAutosize;
exports.TextFieldModule = TextFieldModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=cdk-text-field.umd.js.map