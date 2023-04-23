import { _registerComponent, registerVersion, _getProvider, getApp, _removeServiceInstance, SDK_VERSION } from '@firebase/app';
import { Component } from '@firebase/component';
import { Logger, LogLevel } from '@firebase/logger';
import { FirebaseError, createMockUserToken, getModularInstance, deepEqual, getDefaultEmulatorHostnameAndPort, getUA, isIndexedDBAvailable, isSafari } from '@firebase/util';
import { XhrIo, EventType, ErrorCode, createWebChannelTransport, getStatEventTarget, FetchXmlHttpFactory, WebChannel, Event, Stat } from '@firebase/webchannel-wrapper';

const v = "@firebase/firestore";

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Simple wrapper around a nullable UID. Mostly exists to make code more
 * readable.
 */
class b {
    constructor(t) {
        this.uid = t;
    }
    isAuthenticated() {
        return null != this.uid;
    }
    /**
     * Returns a key representing this user, suitable for inclusion in a
     * dictionary.
     */    toKey() {
        return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
    }
    isEqual(t) {
        return t.uid === this.uid;
    }
}

/** A user with a null UID. */ b.UNAUTHENTICATED = new b(null), 
// TODO(mikelehen): Look into getting a proper uid-equivalent for
// non-FirebaseAuth providers.
b.GOOGLE_CREDENTIALS = new b("google-credentials-uid"), b.FIRST_PARTY = new b("first-party-uid"), 
b.MOCK_USER = new b("mock-user");

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let P = "9.20.0";

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const V = new Logger("@firebase/firestore");

// Helper methods are needed because variables can't be exported as read/write
function S() {
    return V.logLevel;
}

/**
 * Sets the verbosity of Cloud Firestore logs (debug, error, or silent).
 *
 * @param logLevel - The verbosity you set for activity and error logging. Can
 *   be any of the following values:
 *
 *   <ul>
 *     <li>`debug` for the most verbose logging level, primarily for
 *     debugging.</li>
 *     <li>`error` to log errors only.</li>
 *     <li><code>`silent` to turn off logging.</li>
 *   </ul>
 */ function D(t) {
    V.setLogLevel(t);
}

function C(t, ...e) {
    if (V.logLevel <= LogLevel.DEBUG) {
        const n = e.map(k);
        V.debug(`Firestore (${P}): ${t}`, ...n);
    }
}

function x(t, ...e) {
    if (V.logLevel <= LogLevel.ERROR) {
        const n = e.map(k);
        V.error(`Firestore (${P}): ${t}`, ...n);
    }
}

/**
 * @internal
 */ function N(t, ...e) {
    if (V.logLevel <= LogLevel.WARN) {
        const n = e.map(k);
        V.warn(`Firestore (${P}): ${t}`, ...n);
    }
}

/**
 * Converts an additional log parameter to a string representation.
 */ function k(t) {
    if ("string" == typeof t) return t;
    try {
        return e = t, JSON.stringify(e);
    } catch (e) {
        // Converting to JSON failed, just log the object directly
        return t;
    }
    /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
    /** Formats an object as a JSON string, suitable for logging. */
    var e;
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Unconditionally fails, throwing an Error with the given message.
 * Messages are stripped in production builds.
 *
 * Returns `never` and can be used in expressions:
 * @example
 * let futureVar = fail('not implemented yet');
 */ function O(t = "Unexpected state") {
    // Log the failure in addition to throw an exception, just in case the
    // exception is swallowed.
    const e = `FIRESTORE (${P}) INTERNAL ASSERTION FAILED: ` + t;
    // NOTE: We don't use FirestoreError here because these are internal failures
    // that cannot be handled by the user. (Also it would create a circular
    // dependency between the error and assert modules which doesn't work.)
    throw x(e), new Error(e);
}

/**
 * Fails if the given assertion condition is false, throwing an Error with the
 * given message if it did.
 *
 * Messages are stripped in production builds.
 */ function $(t, e) {
    t || O();
}

/**
 * Fails if the given assertion condition is false, throwing an Error with the
 * given message if it did.
 *
 * The code of callsites invoking this function are stripped out in production
 * builds. Any side-effects of code within the debugAssert() invocation will not
 * happen in this case.
 *
 * @internal
 */ function M(t, e) {
    t || O();
}

/**
 * Casts `obj` to `T`. In non-production builds, verifies that `obj` is an
 * instance of `T` before casting.
 */ function F(t, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
e) {
    return t;
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const B = {
    // Causes are copied from:
    // https://github.com/grpc/grpc/blob/bceec94ea4fc5f0085d81235d8e1c06798dc341a/include/grpc%2B%2B/impl/codegen/status_code_enum.h
    /** Not an error; returned on success. */
    OK: "ok",
    /** The operation was cancelled (typically by the caller). */
    CANCELLED: "cancelled",
    /** Unknown error or an error from a different error domain. */
    UNKNOWN: "unknown",
    /**
     * Client specified an invalid argument. Note that this differs from
     * FAILED_PRECONDITION. INVALID_ARGUMENT indicates arguments that are
     * problematic regardless of the state of the system (e.g., a malformed file
     * name).
     */
    INVALID_ARGUMENT: "invalid-argument",
    /**
     * Deadline expired before operation could complete. For operations that
     * change the state of the system, this error may be returned even if the
     * operation has completed successfully. For example, a successful response
     * from a server could have been delayed long enough for the deadline to
     * expire.
     */
    DEADLINE_EXCEEDED: "deadline-exceeded",
    /** Some requested entity (e.g., file or directory) was not found. */
    NOT_FOUND: "not-found",
    /**
     * Some entity that we attempted to create (e.g., file or directory) already
     * exists.
     */
    ALREADY_EXISTS: "already-exists",
    /**
     * The caller does not have permission to execute the specified operation.
     * PERMISSION_DENIED must not be used for rejections caused by exhausting
     * some resource (use RESOURCE_EXHAUSTED instead for those errors).
     * PERMISSION_DENIED must not be used if the caller can not be identified
     * (use UNAUTHENTICATED instead for those errors).
     */
    PERMISSION_DENIED: "permission-denied",
    /**
     * The request does not have valid authentication credentials for the
     * operation.
     */
    UNAUTHENTICATED: "unauthenticated",
    /**
     * Some resource has been exhausted, perhaps a per-user quota, or perhaps the
     * entire file system is out of space.
     */
    RESOURCE_EXHAUSTED: "resource-exhausted",
    /**
     * Operation was rejected because the system is not in a state required for
     * the operation's execution. For example, directory to be deleted may be
     * non-empty, an rmdir operation is applied to a non-directory, etc.
     *
     * A litmus test that may help a service implementor in deciding
     * between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE:
     *  (a) Use UNAVAILABLE if the client can retry just the failing call.
     *  (b) Use ABORTED if the client should retry at a higher-level
     *      (e.g., restarting a read-modify-write sequence).
     *  (c) Use FAILED_PRECONDITION if the client should not retry until
     *      the system state has been explicitly fixed. E.g., if an "rmdir"
     *      fails because the directory is non-empty, FAILED_PRECONDITION
     *      should be returned since the client should not retry unless
     *      they have first fixed up the directory by deleting files from it.
     *  (d) Use FAILED_PRECONDITION if the client performs conditional
     *      REST Get/Update/Delete on a resource and the resource on the
     *      server does not match the condition. E.g., conflicting
     *      read-modify-write on the same resource.
     */
    FAILED_PRECONDITION: "failed-precondition",
    /**
     * The operation was aborted, typically due to a concurrency issue like
     * sequencer check failures, transaction aborts, etc.
     *
     * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
     * and UNAVAILABLE.
     */
    ABORTED: "aborted",
    /**
     * Operation was attempted past the valid range. E.g., seeking or reading
     * past end of file.
     *
     * Unlike INVALID_ARGUMENT, this error indicates a problem that may be fixed
     * if the system state changes. For example, a 32-bit file system will
     * generate INVALID_ARGUMENT if asked to read at an offset that is not in the
     * range [0,2^32-1], but it will generate OUT_OF_RANGE if asked to read from
     * an offset past the current file size.
     *
     * There is a fair bit of overlap between FAILED_PRECONDITION and
     * OUT_OF_RANGE. We recommend using OUT_OF_RANGE (the more specific error)
     * when it applies so that callers who are iterating through a space can
     * easily look for an OUT_OF_RANGE error to detect when they are done.
     */
    OUT_OF_RANGE: "out-of-range",
    /** Operation is not implemented or not supported/enabled in this service. */
    UNIMPLEMENTED: "unimplemented",
    /**
     * Internal errors. Means some invariants expected by underlying System has
     * been broken. If you see one of these errors, Something is very broken.
     */
    INTERNAL: "internal",
    /**
     * The service is currently unavailable. This is a most likely a transient
     * condition and may be corrected by retrying with a backoff.
     *
     * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
     * and UNAVAILABLE.
     */
    UNAVAILABLE: "unavailable",
    /** Unrecoverable data loss or corruption. */
    DATA_LOSS: "data-loss"
};

/** An error returned by a Firestore operation. */ class L extends FirebaseError {
    /** @hideconstructor */
    constructor(
    /**
     * The backend error code associated with this error.
     */
    t, 
    /**
     * A custom error description.
     */
    e) {
        super(t, e), this.code = t, this.message = e, 
        // HACK: We write a toString property directly because Error is not a real
        // class and so inheritance does not work correctly. We could alternatively
        // do the same "back-door inheritance" trick that FirebaseError does.
        this.toString = () => `${this.name}: [code=${this.code}]: ${this.message}`;
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class q {
    constructor() {
        this.promise = new Promise(((t, e) => {
            this.resolve = t, this.reject = e;
        }));
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class U {
    constructor(t, e) {
        this.user = e, this.type = "OAuth", this.headers = new Map, this.headers.set("Authorization", `Bearer ${t}`);
    }
}

/**
 * A CredentialsProvider that always yields an empty token.
 * @internal
 */ class K {
    getToken() {
        return Promise.resolve(null);
    }
    invalidateToken() {}
    start(t, e) {
        // Fire with initial user.
        t.enqueueRetryable((() => e(b.UNAUTHENTICATED)));
    }
    shutdown() {}
}

/**
 * A CredentialsProvider that always returns a constant token. Used for
 * emulator token mocking.
 */ class G {
    constructor(t) {
        this.token = t, 
        /**
         * Stores the listener registered with setChangeListener()
         * This isn't actually necessary since the UID never changes, but we use this
         * to verify the listen contract is adhered to in tests.
         */
        this.changeListener = null;
    }
    getToken() {
        return Promise.resolve(this.token);
    }
    invalidateToken() {}
    start(t, e) {
        this.changeListener = e, 
        // Fire with initial user.
        t.enqueueRetryable((() => e(this.token.user)));
    }
    shutdown() {
        this.changeListener = null;
    }
}

class Q {
    constructor(t) {
        this.t = t, 
        /** Tracks the current User. */
        this.currentUser = b.UNAUTHENTICATED, 
        /**
         * Counter used to detect if the token changed while a getToken request was
         * outstanding.
         */
        this.i = 0, this.forceRefresh = !1, this.auth = null;
    }
    start(t, e) {
        let n = this.i;
        // A change listener that prevents double-firing for the same token change.
                const s = t => this.i !== n ? (n = this.i, e(t)) : Promise.resolve();
        // A promise that can be waited on to block on the next token change.
        // This promise is re-created after each change.
                let i = new q;
        this.o = () => {
            this.i++, this.currentUser = this.u(), i.resolve(), i = new q, t.enqueueRetryable((() => s(this.currentUser)));
        };
        const r = () => {
            const e = i;
            t.enqueueRetryable((async () => {
                await e.promise, await s(this.currentUser);
            }));
        }, o = t => {
            C("FirebaseAuthCredentialsProvider", "Auth detected"), this.auth = t, this.auth.addAuthTokenListener(this.o), 
            r();
        };
        this.t.onInit((t => o(t))), 
        // Our users can initialize Auth right after Firestore, so we give it
        // a chance to register itself with the component framework before we
        // determine whether to start up in unauthenticated mode.
        setTimeout((() => {
            if (!this.auth) {
                const t = this.t.getImmediate({
                    optional: !0
                });
                t ? o(t) : (
                // If auth is still not available, proceed with `null` user
                C("FirebaseAuthCredentialsProvider", "Auth not yet detected"), i.resolve(), i = new q);
            }
        }), 0), r();
    }
    getToken() {
        // Take note of the current value of the tokenCounter so that this method
        // can fail (with an ABORTED error) if there is a token change while the
        // request is outstanding.
        const t = this.i, e = this.forceRefresh;
        return this.forceRefresh = !1, this.auth ? this.auth.getToken(e).then((e => 
        // Cancel the request since the token changed while the request was
        // outstanding so the response is potentially for a previous user (which
        // user, we can't be sure).
        this.i !== t ? (C("FirebaseAuthCredentialsProvider", "getToken aborted due to token change."), 
        this.getToken()) : e ? ($("string" == typeof e.accessToken), new U(e.accessToken, this.currentUser)) : null)) : Promise.resolve(null);
    }
    invalidateToken() {
        this.forceRefresh = !0;
    }
    shutdown() {
        this.auth && this.auth.removeAuthTokenListener(this.o);
    }
    // Auth.getUid() can return null even with a user logged in. It is because
    // getUid() is synchronous, but the auth code populating Uid is asynchronous.
    // This method should only be called in the AuthTokenListener callback
    // to guarantee to get the actual user.
    u() {
        const t = this.auth && this.auth.getUid();
        return $(null === t || "string" == typeof t), new b(t);
    }
}

/*
 * FirstPartyToken provides a fresh token each time its value
 * is requested, because if the token is too old, requests will be rejected.
 * Technically this may no longer be necessary since the SDK should gracefully
 * recover from unauthenticated errors (see b/33147818 for context), but it's
 * safer to keep the implementation as-is.
 */ class z {
    constructor(t, e, n) {
        this.h = t, this.l = e, this.m = n, this.type = "FirstParty", this.user = b.FIRST_PARTY, 
        this.g = new Map;
    }
    /**
     * Gets an authorization token, using a provided factory function, or return
     * null.
     */    p() {
        return this.m ? this.m() : null;
    }
    get headers() {
        this.g.set("X-Goog-AuthUser", this.h);
        // Use array notation to prevent minification
        const t = this.p();
        return t && this.g.set("Authorization", t), this.l && this.g.set("X-Goog-Iam-Authorization-Token", this.l), 
        this.g;
    }
}

/*
 * Provides user credentials required for the Firestore JavaScript SDK
 * to authenticate the user, using technique that is only available
 * to applications hosted by Google.
 */ class j {
    constructor(t, e, n) {
        this.h = t, this.l = e, this.m = n;
    }
    getToken() {
        return Promise.resolve(new z(this.h, this.l, this.m));
    }
    start(t, e) {
        // Fire with initial uid.
        t.enqueueRetryable((() => e(b.FIRST_PARTY)));
    }
    shutdown() {}
    invalidateToken() {}
}

class W {
    constructor(t) {
        this.value = t, this.type = "AppCheck", this.headers = new Map, t && t.length > 0 && this.headers.set("x-firebase-appcheck", this.value);
    }
}

class H {
    constructor(t) {
        this.I = t, this.forceRefresh = !1, this.appCheck = null, this.T = null;
    }
    start(t, e) {
        const n = t => {
            null != t.error && C("FirebaseAppCheckTokenProvider", `Error getting App Check token; using placeholder token instead. Error: ${t.error.message}`);
            const n = t.token !== this.T;
            return this.T = t.token, C("FirebaseAppCheckTokenProvider", `Received ${n ? "new" : "existing"} token.`), 
            n ? e(t.token) : Promise.resolve();
        };
        this.o = e => {
            t.enqueueRetryable((() => n(e)));
        };
        const s = t => {
            C("FirebaseAppCheckTokenProvider", "AppCheck detected"), this.appCheck = t, this.appCheck.addTokenListener(this.o);
        };
        this.I.onInit((t => s(t))), 
        // Our users can initialize AppCheck after Firestore, so we give it
        // a chance to register itself with the component framework.
        setTimeout((() => {
            if (!this.appCheck) {
                const t = this.I.getImmediate({
                    optional: !0
                });
                t ? s(t) : 
                // If AppCheck is still not available, proceed without it.
                C("FirebaseAppCheckTokenProvider", "AppCheck not yet detected");
            }
        }), 0);
    }
    getToken() {
        const t = this.forceRefresh;
        return this.forceRefresh = !1, this.appCheck ? this.appCheck.getToken(t).then((t => t ? ($("string" == typeof t.token), 
        this.T = t.token, new W(t.token)) : null)) : Promise.resolve(null);
    }
    invalidateToken() {
        this.forceRefresh = !0;
    }
    shutdown() {
        this.appCheck && this.appCheck.removeTokenListener(this.o);
    }
}

/**
 * An AppCheck token provider that always yields an empty token.
 * @internal
 */ class J {
    getToken() {
        return Promise.resolve(new W(""));
    }
    invalidateToken() {}
    start(t, e) {}
    shutdown() {}
}

/**
 * Builds a CredentialsProvider depending on the type of
 * the credentials passed in.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Generates `nBytes` of random bytes.
 *
 * If `nBytes < 0` , an error will be thrown.
 */
function Y(t) {
    // Polyfills for IE and WebWorker by using `self` and `msCrypto` when `crypto` is not available.
    const e = 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    "undefined" != typeof self && (self.crypto || self.msCrypto), n = new Uint8Array(t);
    if (e && "function" == typeof e.getRandomValues) e.getRandomValues(n); else 
    // Falls back to Math.random
    for (let e = 0; e < t; e++) n[e] = Math.floor(256 * Math.random());
    return n;
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Z {
    static A() {
        // Alphanumeric characters
        const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", e = Math.floor(256 / t.length) * t.length;
        // The largest byte value that is a multiple of `char.length`.
                let n = "";
        for (;n.length < 20; ) {
            const s = Y(40);
            for (let i = 0; i < s.length; ++i) 
            // Only accept values that are [0, maxMultiple), this ensures they can
            // be evenly mapped to indices of `chars` via a modulo operation.
            n.length < 20 && s[i] < e && (n += t.charAt(s[i] % t.length));
        }
        return n;
    }
}

function X(t, e) {
    return t < e ? -1 : t > e ? 1 : 0;
}

/** Helper to compare arrays using isEqual(). */ function tt(t, e, n) {
    return t.length === e.length && t.every(((t, s) => n(t, e[s])));
}

/**
 * Returns the immediate lexicographically-following string. This is useful to
 * construct an inclusive range for indexeddb iterators.
 */ function et(t) {
    // Return the input string, with an additional NUL byte appended.
    return t + "\0";
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// The earliest date supported by Firestore timestamps (0001-01-01T00:00:00Z).
/**
 * A `Timestamp` represents a point in time independent of any time zone or
 * calendar, represented as seconds and fractions of seconds at nanosecond
 * resolution in UTC Epoch time.
 *
 * It is encoded using the Proleptic Gregorian Calendar which extends the
 * Gregorian calendar backwards to year one. It is encoded assuming all minutes
 * are 60 seconds long, i.e. leap seconds are "smeared" so that no leap second
 * table is needed for interpretation. Range is from 0001-01-01T00:00:00Z to
 * 9999-12-31T23:59:59.999999999Z.
 *
 * For examples and further specifications, refer to the
 * {@link https://github.com/google/protobuf/blob/master/src/google/protobuf/timestamp.proto | Timestamp definition}.
 */
class nt {
    /**
     * Creates a new timestamp.
     *
     * @param seconds - The number of seconds of UTC time since Unix epoch
     *     1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
     *     9999-12-31T23:59:59Z inclusive.
     * @param nanoseconds - The non-negative fractions of a second at nanosecond
     *     resolution. Negative second values with fractions must still have
     *     non-negative nanoseconds values that count forward in time. Must be
     *     from 0 to 999,999,999 inclusive.
     */
    constructor(
    /**
     * The number of seconds of UTC time since Unix epoch 1970-01-01T00:00:00Z.
     */
    t, 
    /**
     * The fractions of a second at nanosecond resolution.*
     */
    e) {
        if (this.seconds = t, this.nanoseconds = e, e < 0) throw new L(B.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + e);
        if (e >= 1e9) throw new L(B.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + e);
        if (t < -62135596800) throw new L(B.INVALID_ARGUMENT, "Timestamp seconds out of range: " + t);
        // This will break in the year 10,000.
                if (t >= 253402300800) throw new L(B.INVALID_ARGUMENT, "Timestamp seconds out of range: " + t);
    }
    /**
     * Creates a new timestamp with the current date, with millisecond precision.
     *
     * @returns a new timestamp representing the current date.
     */    static now() {
        return nt.fromMillis(Date.now());
    }
    /**
     * Creates a new timestamp from the given date.
     *
     * @param date - The date to initialize the `Timestamp` from.
     * @returns A new `Timestamp` representing the same point in time as the given
     *     date.
     */    static fromDate(t) {
        return nt.fromMillis(t.getTime());
    }
    /**
     * Creates a new timestamp from the given number of milliseconds.
     *
     * @param milliseconds - Number of milliseconds since Unix epoch
     *     1970-01-01T00:00:00Z.
     * @returns A new `Timestamp` representing the same point in time as the given
     *     number of milliseconds.
     */    static fromMillis(t) {
        const e = Math.floor(t / 1e3), n = Math.floor(1e6 * (t - 1e3 * e));
        return new nt(e, n);
    }
    /**
     * Converts a `Timestamp` to a JavaScript `Date` object. This conversion
     * causes a loss of precision since `Date` objects only support millisecond
     * precision.
     *
     * @returns JavaScript `Date` object representing the same point in time as
     *     this `Timestamp`, with millisecond precision.
     */    toDate() {
        return new Date(this.toMillis());
    }
    /**
     * Converts a `Timestamp` to a numeric timestamp (in milliseconds since
     * epoch). This operation causes a loss of precision.
     *
     * @returns The point in time corresponding to this timestamp, represented as
     *     the number of milliseconds since Unix epoch 1970-01-01T00:00:00Z.
     */    toMillis() {
        return 1e3 * this.seconds + this.nanoseconds / 1e6;
    }
    _compareTo(t) {
        return this.seconds === t.seconds ? X(this.nanoseconds, t.nanoseconds) : X(this.seconds, t.seconds);
    }
    /**
     * Returns true if this `Timestamp` is equal to the provided one.
     *
     * @param other - The `Timestamp` to compare against.
     * @returns true if this `Timestamp` is equal to the provided one.
     */    isEqual(t) {
        return t.seconds === this.seconds && t.nanoseconds === this.nanoseconds;
    }
    /** Returns a textual representation of this `Timestamp`. */    toString() {
        return "Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")";
    }
    /** Returns a JSON-serializable representation of this `Timestamp`. */    toJSON() {
        return {
            seconds: this.seconds,
            nanoseconds: this.nanoseconds
        };
    }
    /**
     * Converts this object to a primitive string, which allows `Timestamp` objects
     * to be compared using the `>`, `<=`, `>=` and `>` operators.
     */    valueOf() {
        // This method returns a string of the form <seconds>.<nanoseconds> where
        // <seconds> is translated to have a non-negative value and both <seconds>
        // and <nanoseconds> are left-padded with zeroes to be a consistent length.
        // Strings with this format then have a lexiographical ordering that matches
        // the expected ordering. The <seconds> translation is done to avoid having
        // a leading negative sign (i.e. a leading '-' character) in its string
        // representation, which would affect its lexiographical ordering.
        const t = this.seconds - -62135596800;
        // Note: Up to 12 decimal digits are required to represent all valid
        // 'seconds' values.
                return String(t).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A version of a document in Firestore. This corresponds to the version
 * timestamp, such as update_time or read_time.
 */ class st {
    constructor(t) {
        this.timestamp = t;
    }
    static fromTimestamp(t) {
        return new st(t);
    }
    static min() {
        return new st(new nt(0, 0));
    }
    static max() {
        return new st(new nt(253402300799, 999999999));
    }
    compareTo(t) {
        return this.timestamp._compareTo(t.timestamp);
    }
    isEqual(t) {
        return this.timestamp.isEqual(t.timestamp);
    }
    /** Returns a number representation of the version for use in spec tests. */    toMicroseconds() {
        // Convert to microseconds.
        return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1e3;
    }
    toString() {
        return "SnapshotVersion(" + this.timestamp.toString() + ")";
    }
    toTimestamp() {
        return this.timestamp;
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Path represents an ordered sequence of string segments.
 */
class it {
    constructor(t, e, n) {
        void 0 === e ? e = 0 : e > t.length && O(), void 0 === n ? n = t.length - e : n > t.length - e && O(), 
        this.segments = t, this.offset = e, this.len = n;
    }
    get length() {
        return this.len;
    }
    isEqual(t) {
        return 0 === it.comparator(this, t);
    }
    child(t) {
        const e = this.segments.slice(this.offset, this.limit());
        return t instanceof it ? t.forEach((t => {
            e.push(t);
        })) : e.push(t), this.construct(e);
    }
    /** The index of one past the last segment of the path. */    limit() {
        return this.offset + this.length;
    }
    popFirst(t) {
        return t = void 0 === t ? 1 : t, this.construct(this.segments, this.offset + t, this.length - t);
    }
    popLast() {
        return this.construct(this.segments, this.offset, this.length - 1);
    }
    firstSegment() {
        return this.segments[this.offset];
    }
    lastSegment() {
        return this.get(this.length - 1);
    }
    get(t) {
        return this.segments[this.offset + t];
    }
    isEmpty() {
        return 0 === this.length;
    }
    isPrefixOf(t) {
        if (t.length < this.length) return !1;
        for (let e = 0; e < this.length; e++) if (this.get(e) !== t.get(e)) return !1;
        return !0;
    }
    isImmediateParentOf(t) {
        if (this.length + 1 !== t.length) return !1;
        for (let e = 0; e < this.length; e++) if (this.get(e) !== t.get(e)) return !1;
        return !0;
    }
    forEach(t) {
        for (let e = this.offset, n = this.limit(); e < n; e++) t(this.segments[e]);
    }
    toArray() {
        return this.segments.slice(this.offset, this.limit());
    }
    static comparator(t, e) {
        const n = Math.min(t.length, e.length);
        for (let s = 0; s < n; s++) {
            const n = t.get(s), i = e.get(s);
            if (n < i) return -1;
            if (n > i) return 1;
        }
        return t.length < e.length ? -1 : t.length > e.length ? 1 : 0;
    }
}

/**
 * A slash-separated path for navigating resources (documents and collections)
 * within Firestore.
 *
 * @internal
 */ class rt extends it {
    construct(t, e, n) {
        return new rt(t, e, n);
    }
    canonicalString() {
        // NOTE: The client is ignorant of any path segments containing escape
        // sequences (e.g. __id123__) and just passes them through raw (they exist
        // for legacy reasons and should not be used frequently).
        return this.toArray().join("/");
    }
    toString() {
        return this.canonicalString();
    }
    /**
     * Creates a resource path from the given slash-delimited string. If multiple
     * arguments are provided, all components are combined. Leading and trailing
     * slashes from all components are ignored.
     */    static fromString(...t) {
        // NOTE: The client is ignorant of any path segments containing escape
        // sequences (e.g. __id123__) and just passes them through raw (they exist
        // for legacy reasons and should not be used frequently).
        const e = [];
        for (const n of t) {
            if (n.indexOf("//") >= 0) throw new L(B.INVALID_ARGUMENT, `Invalid segment (${n}). Paths must not contain // in them.`);
            // Strip leading and traling slashed.
                        e.push(...n.split("/").filter((t => t.length > 0)));
        }
        return new rt(e);
    }
    static emptyPath() {
        return new rt([]);
    }
}

const ot = /^[_a-zA-Z][_a-zA-Z0-9]*$/;

/**
 * A dot-separated path for navigating sub-objects within a document.
 * @internal
 */ class ut extends it {
    construct(t, e, n) {
        return new ut(t, e, n);
    }
    /**
     * Returns true if the string could be used as a segment in a field path
     * without escaping.
     */    static isValidIdentifier(t) {
        return ot.test(t);
    }
    canonicalString() {
        return this.toArray().map((t => (t = t.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), 
        ut.isValidIdentifier(t) || (t = "`" + t + "`"), t))).join(".");
    }
    toString() {
        return this.canonicalString();
    }
    /**
     * Returns true if this field references the key of a document.
     */    isKeyField() {
        return 1 === this.length && "__name__" === this.get(0);
    }
    /**
     * The field designating the key of a document.
     */    static keyField() {
        return new ut([ "__name__" ]);
    }
    /**
     * Parses a field string from the given server-formatted string.
     *
     * - Splitting the empty string is not allowed (for now at least).
     * - Empty segments within the string (e.g. if there are two consecutive
     *   separators) are not allowed.
     *
     * TODO(b/37244157): we should make this more strict. Right now, it allows
     * non-identifier path components, even if they aren't escaped.
     */    static fromServerFormat(t) {
        const e = [];
        let n = "", s = 0;
        const i = () => {
            if (0 === n.length) throw new L(B.INVALID_ARGUMENT, `Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
            e.push(n), n = "";
        };
        let r = !1;
        for (;s < t.length; ) {
            const e = t[s];
            if ("\\" === e) {
                if (s + 1 === t.length) throw new L(B.INVALID_ARGUMENT, "Path has trailing escape character: " + t);
                const e = t[s + 1];
                if ("\\" !== e && "." !== e && "`" !== e) throw new L(B.INVALID_ARGUMENT, "Path has invalid escape sequence: " + t);
                n += e, s += 2;
            } else "`" === e ? (r = !r, s++) : "." !== e || r ? (n += e, s++) : (i(), s++);
        }
        if (i(), r) throw new L(B.INVALID_ARGUMENT, "Unterminated ` in path: " + t);
        return new ut(e);
    }
    static emptyPath() {
        return new ut([]);
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @internal
 */ class ct {
    constructor(t) {
        this.path = t;
    }
    static fromPath(t) {
        return new ct(rt.fromString(t));
    }
    static fromName(t) {
        return new ct(rt.fromString(t).popFirst(5));
    }
    static empty() {
        return new ct(rt.emptyPath());
    }
    get collectionGroup() {
        return this.path.popLast().lastSegment();
    }
    /** Returns true if the document is in the specified collectionId. */    hasCollectionId(t) {
        return this.path.length >= 2 && this.path.get(this.path.length - 2) === t;
    }
    /** Returns the collection group (i.e. the name of the parent collection) for this key. */    getCollectionGroup() {
        return this.path.get(this.path.length - 2);
    }
    /** Returns the fully qualified path to the parent collection. */    getCollectionPath() {
        return this.path.popLast();
    }
    isEqual(t) {
        return null !== t && 0 === rt.comparator(this.path, t.path);
    }
    toString() {
        return this.path.toString();
    }
    static comparator(t, e) {
        return rt.comparator(t.path, e.path);
    }
    static isDocumentKey(t) {
        return t.length % 2 == 0;
    }
    /**
     * Creates and returns a new document key with the given segments.
     *
     * @param segments - The segments of the path to the document
     * @returns A new instance of DocumentKey
     */    static fromSegments(t) {
        return new ct(new rt(t.slice()));
    }
}

/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * The initial mutation batch id for each index. Gets updated during index
 * backfill.
 */
/**
 * An index definition for field indexes in Firestore.
 *
 * Every index is associated with a collection. The definition contains a list
 * of fields and their index kind (which can be `ASCENDING`, `DESCENDING` or
 * `CONTAINS` for ArrayContains/ArrayContainsAny queries).
 *
 * Unlike the backend, the SDK does not differentiate between collection or
 * collection group-scoped indices. Every index can be used for both single
 * collection and collection group queries.
 */
class at {
    constructor(
    /**
     * The index ID. Returns -1 if the index ID is not available (e.g. the index
     * has not yet been persisted).
     */
    t, 
    /** The collection ID this index applies to. */
    e, 
    /** The field segments for this index. */
    n, 
    /** Shows how up-to-date the index is for the current user. */
    s) {
        this.indexId = t, this.collectionGroup = e, this.fields = n, this.indexState = s;
    }
}

/** An ID for an index that has not yet been added to persistence.  */
/** Returns the ArrayContains/ArrayContainsAny segment for this index. */
function ht(t) {
    return t.fields.find((t => 2 /* IndexKind.CONTAINS */ === t.kind));
}

/** Returns all directional (ascending/descending) segments for this index. */ function lt(t) {
    return t.fields.filter((t => 2 /* IndexKind.CONTAINS */ !== t.kind));
}

/**
 * Returns the order of the document key component for the given index.
 *
 * PORTING NOTE: This is only used in the Web IndexedDb implementation.
 */
/**
 * Compares indexes by collection group and segments. Ignores update time and
 * index ID.
 */
function ft(t, e) {
    let n = X(t.collectionGroup, e.collectionGroup);
    if (0 !== n) return n;
    for (let s = 0; s < Math.min(t.fields.length, e.fields.length); ++s) if (n = wt(t.fields[s], e.fields[s]), 
    0 !== n) return n;
    return X(t.fields.length, e.fields.length);
}

/** Returns a debug representation of the field index */ at.UNKNOWN_ID = -1;

/** An index component consisting of field path and index type.  */
class dt {
    constructor(
    /** The field path of the component. */
    t, 
    /** The fields sorting order. */
    e) {
        this.fieldPath = t, this.kind = e;
    }
}

function wt(t, e) {
    const n = ut.comparator(t.fieldPath, e.fieldPath);
    return 0 !== n ? n : X(t.kind, e.kind);
}

/**
 * Stores the "high water mark" that indicates how updated the Index is for the
 * current user.
 */ class _t {
    constructor(
    /**
     * Indicates when the index was last updated (relative to other indexes).
     */
    t, 
    /** The the latest indexed read time, document and batch id. */
    e) {
        this.sequenceNumber = t, this.offset = e;
    }
    /** The state of an index that has not yet been backfilled. */    static empty() {
        return new _t(0, yt.min());
    }
}

/**
 * Creates an offset that matches all documents with a read time higher than
 * `readTime`.
 */ function mt(t, e) {
    // We want to create an offset that matches all documents with a read time
    // greater than the provided read time. To do so, we technically need to
    // create an offset for `(readTime, MAX_DOCUMENT_KEY)`. While we could use
    // Unicode codepoints to generate MAX_DOCUMENT_KEY, it is much easier to use
    // `(readTime + 1, DocumentKey.empty())` since `> DocumentKey.empty()` matches
    // all valid document IDs.
    const n = t.toTimestamp().seconds, s = t.toTimestamp().nanoseconds + 1, i = st.fromTimestamp(1e9 === s ? new nt(n + 1, 0) : new nt(n, s));
    return new yt(i, ct.empty(), e);
}

/** Creates a new offset based on the provided document. */ function gt(t) {
    return new yt(t.readTime, t.key, -1);
}

/**
 * Stores the latest read time, document and batch ID that were processed for an
 * index.
 */ class yt {
    constructor(
    /**
     * The latest read time version that has been indexed by Firestore for this
     * field index.
     */
    t, 
    /**
     * The key of the last document that was indexed for this query. Use
     * `DocumentKey.empty()` if no document has been indexed.
     */
    e, 
    /*
     * The largest mutation batch id that's been processed by Firestore.
     */
    n) {
        this.readTime = t, this.documentKey = e, this.largestBatchId = n;
    }
    /** Returns an offset that sorts before all regular offsets. */    static min() {
        return new yt(st.min(), ct.empty(), -1);
    }
    /** Returns an offset that sorts after all regular offsets. */    static max() {
        return new yt(st.max(), ct.empty(), -1);
    }
}

function pt(t, e) {
    let n = t.readTime.compareTo(e.readTime);
    return 0 !== n ? n : (n = ct.comparator(t.documentKey, e.documentKey), 0 !== n ? n : X(t.largestBatchId, e.largestBatchId));
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const It = "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";

/**
 * A base class representing a persistence transaction, encapsulating both the
 * transaction's sequence numbers as well as a list of onCommitted listeners.
 *
 * When you call Persistence.runTransaction(), it will create a transaction and
 * pass it to your callback. You then pass it to any method that operates
 * on persistence.
 */ class Tt {
    constructor() {
        this.onCommittedListeners = [];
    }
    addOnCommittedListener(t) {
        this.onCommittedListeners.push(t);
    }
    raiseOnCommittedEvent() {
        this.onCommittedListeners.forEach((t => t()));
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Verifies the error thrown by a LocalStore operation. If a LocalStore
 * operation fails because the primary lease has been taken by another client,
 * we ignore the error (the persistence layer will immediately call
 * `applyPrimaryLease` to propagate the primary state change). All other errors
 * are re-thrown.
 *
 * @param err - An error returned by a LocalStore operation.
 * @returns A Promise that resolves after we recovered, or the original error.
 */ async function Et(t) {
    if (t.code !== B.FAILED_PRECONDITION || t.message !== It) throw t;
    C("LocalStore", "Unexpectedly lost primary lease");
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * PersistencePromise is essentially a re-implementation of Promise except
 * it has a .next() method instead of .then() and .next() and .catch() callbacks
 * are executed synchronously when a PersistencePromise resolves rather than
 * asynchronously (Promise implementations use setImmediate() or similar).
 *
 * This is necessary to interoperate with IndexedDB which will automatically
 * commit transactions if control is returned to the event loop without
 * synchronously initiating another operation on the transaction.
 *
 * NOTE: .then() and .catch() only allow a single consumer, unlike normal
 * Promises.
 */ class At {
    constructor(t) {
        // NOTE: next/catchCallback will always point to our own wrapper functions,
        // not the user's raw next() or catch() callbacks.
        this.nextCallback = null, this.catchCallback = null, 
        // When the operation resolves, we'll set result or error and mark isDone.
        this.result = void 0, this.error = void 0, this.isDone = !1, 
        // Set to true when .then() or .catch() are called and prevents additional
        // chaining.
        this.callbackAttached = !1, t((t => {
            this.isDone = !0, this.result = t, this.nextCallback && 
            // value should be defined unless T is Void, but we can't express
            // that in the type system.
            this.nextCallback(t);
        }), (t => {
            this.isDone = !0, this.error = t, this.catchCallback && this.catchCallback(t);
        }));
    }
    catch(t) {
        return this.next(void 0, t);
    }
    next(t, e) {
        return this.callbackAttached && O(), this.callbackAttached = !0, this.isDone ? this.error ? this.wrapFailure(e, this.error) : this.wrapSuccess(t, this.result) : new At(((n, s) => {
            this.nextCallback = e => {
                this.wrapSuccess(t, e).next(n, s);
            }, this.catchCallback = t => {
                this.wrapFailure(e, t).next(n, s);
            };
        }));
    }
    toPromise() {
        return new Promise(((t, e) => {
            this.next(t, e);
        }));
    }
    wrapUserFunction(t) {
        try {
            const e = t();
            return e instanceof At ? e : At.resolve(e);
        } catch (t) {
            return At.reject(t);
        }
    }
    wrapSuccess(t, e) {
        return t ? this.wrapUserFunction((() => t(e))) : At.resolve(e);
    }
    wrapFailure(t, e) {
        return t ? this.wrapUserFunction((() => t(e))) : At.reject(e);
    }
    static resolve(t) {
        return new At(((e, n) => {
            e(t);
        }));
    }
    static reject(t) {
        return new At(((e, n) => {
            n(t);
        }));
    }
    static waitFor(
    // Accept all Promise types in waitFor().
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t) {
        return new At(((e, n) => {
            let s = 0, i = 0, r = !1;
            t.forEach((t => {
                ++s, t.next((() => {
                    ++i, r && i === s && e();
                }), (t => n(t)));
            })), r = !0, i === s && e();
        }));
    }
    /**
     * Given an array of predicate functions that asynchronously evaluate to a
     * boolean, implements a short-circuiting `or` between the results. Predicates
     * will be evaluated until one of them returns `true`, then stop. The final
     * result will be whether any of them returned `true`.
     */    static or(t) {
        let e = At.resolve(!1);
        for (const n of t) e = e.next((t => t ? At.resolve(t) : n()));
        return e;
    }
    static forEach(t, e) {
        const n = [];
        return t.forEach(((t, s) => {
            n.push(e.call(this, t, s));
        })), this.waitFor(n);
    }
    /**
     * Concurrently map all array elements through asynchronous function.
     */    static mapArray(t, e) {
        return new At(((n, s) => {
            const i = t.length, r = new Array(i);
            let o = 0;
            for (let u = 0; u < i; u++) {
                const c = u;
                e(t[c]).next((t => {
                    r[c] = t, ++o, o === i && n(r);
                }), (t => s(t)));
            }
        }));
    }
    /**
     * An alternative to recursive PersistencePromise calls, that avoids
     * potential memory problems from unbounded chains of promises.
     *
     * The `action` will be called repeatedly while `condition` is true.
     */    static doWhile(t, e) {
        return new At(((n, s) => {
            const i = () => {
                !0 === t() ? e().next((() => {
                    i();
                }), s) : n();
            };
            i();
        }));
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// References to `window` are guarded by SimpleDb.isAvailable()
/* eslint-disable no-restricted-globals */
/**
 * Wraps an IDBTransaction and exposes a store() method to get a handle to a
 * specific object store.
 */
class Rt {
    constructor(t, e) {
        this.action = t, this.transaction = e, this.aborted = !1, 
        /**
         * A `Promise` that resolves with the result of the IndexedDb transaction.
         */
        this.R = new q, this.transaction.oncomplete = () => {
            this.R.resolve();
        }, this.transaction.onabort = () => {
            e.error ? this.R.reject(new Pt(t, e.error)) : this.R.resolve();
        }, this.transaction.onerror = e => {
            const n = xt(e.target.error);
            this.R.reject(new Pt(t, n));
        };
    }
    static open(t, e, n, s) {
        try {
            return new Rt(e, t.transaction(s, n));
        } catch (t) {
            throw new Pt(e, t);
        }
    }
    get v() {
        return this.R.promise;
    }
    abort(t) {
        t && this.R.reject(t), this.aborted || (C("SimpleDb", "Aborting transaction:", t ? t.message : "Client-initiated abort"), 
        this.aborted = !0, this.transaction.abort());
    }
    P() {
        // If the browser supports V3 IndexedDB, we invoke commit() explicitly to
        // speed up index DB processing if the event loop remains blocks.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const t = this.transaction;
        this.aborted || "function" != typeof t.commit || t.commit();
    }
    /**
     * Returns a SimpleDbStore<KeyType, ValueType> for the specified store. All
     * operations performed on the SimpleDbStore happen within the context of this
     * transaction and it cannot be used anymore once the transaction is
     * completed.
     *
     * Note that we can't actually enforce that the KeyType and ValueType are
     * correct, but they allow type safety through the rest of the consuming code.
     */    store(t) {
        const e = this.transaction.objectStore(t);
        return new St(e);
    }
}

/**
 * Provides a wrapper around IndexedDb with a simplified interface that uses
 * Promise-like return values to chain operations. Real promises cannot be used
 * since .then() continuations are executed asynchronously (e.g. via
 * .setImmediate), which would cause IndexedDB to end the transaction.
 * See PersistencePromise for more details.
 */ class vt {
    /*
     * Creates a new SimpleDb wrapper for IndexedDb database `name`.
     *
     * Note that `version` must not be a downgrade. IndexedDB does not support
     * downgrading the schema version. We currently do not support any way to do
     * versioning outside of IndexedDB's versioning mechanism, as only
     * version-upgrade transactions are allowed to do things like create
     * objectstores.
     */
    constructor(t, e, n) {
        this.name = t, this.version = e, this.V = n;
        // NOTE: According to https://bugs.webkit.org/show_bug.cgi?id=197050, the
        // bug we're checking for should exist in iOS >= 12.2 and < 13, but for
        // whatever reason it's much harder to hit after 12.2 so we only proactively
        // log on 12.2.
        12.2 === vt.S(getUA()) && x("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.");
    }
    /** Deletes the specified database. */    static delete(t) {
        return C("SimpleDb", "Removing database:", t), Dt(window.indexedDB.deleteDatabase(t)).toPromise();
    }
    /** Returns true if IndexedDB is available in the current environment. */    static D() {
        if (!isIndexedDBAvailable()) return !1;
        if (vt.C()) return !0;
        // We extensively use indexed array values and compound keys,
        // which IE and Edge do not support. However, they still have indexedDB
        // defined on the window, so we need to check for them here and make sure
        // to return that persistence is not enabled for those browsers.
        // For tracking support of this feature, see here:
        // https://developer.microsoft.com/en-us/microsoft-edge/platform/status/indexeddbarraysandmultientrysupport/
        // Check the UA string to find out the browser.
                const t = getUA(), e = vt.S(t), n = 0 < e && e < 10, s = vt.N(t), i = 0 < s && s < 4.5;
        // IE 10
        // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
        // IE 11
        // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
        // Edge
        // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML,
        // like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
        // iOS Safari: Disable for users running iOS version < 10.
                return !(t.indexOf("MSIE ") > 0 || t.indexOf("Trident/") > 0 || t.indexOf("Edge/") > 0 || n || i);
    }
    /**
     * Returns true if the backing IndexedDB store is the Node IndexedDBShim
     * (see https://github.com/axemclion/IndexedDBShim).
     */    static C() {
        var t;
        return "undefined" != typeof process && "YES" === (null === (t = process.env) || void 0 === t ? void 0 : t.k);
    }
    /** Helper to get a typed SimpleDbStore from a transaction. */    static O(t, e) {
        return t.store(e);
    }
    // visible for testing
    /** Parse User Agent to determine iOS version. Returns -1 if not found. */
    static S(t) {
        const e = t.match(/i(?:phone|pad|pod) os ([\d_]+)/i), n = e ? e[1].split("_").slice(0, 2).join(".") : "-1";
        return Number(n);
    }
    // visible for testing
    /** Parse User Agent to determine Android version. Returns -1 if not found. */
    static N(t) {
        const e = t.match(/Android ([\d.]+)/i), n = e ? e[1].split(".").slice(0, 2).join(".") : "-1";
        return Number(n);
    }
    /**
     * Opens the specified database, creating or upgrading it if necessary.
     */    async $(t) {
        return this.db || (C("SimpleDb", "Opening database:", this.name), this.db = await new Promise(((e, n) => {
            // TODO(mikelehen): Investigate browser compatibility.
            // https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
            // suggests IE9 and older WebKit browsers handle upgrade
            // differently. They expect setVersion, as described here:
            // https://developer.mozilla.org/en-US/docs/Web/API/IDBVersionChangeRequest/setVersion
            const s = indexedDB.open(this.name, this.version);
            s.onsuccess = t => {
                const n = t.target.result;
                e(n);
            }, s.onblocked = () => {
                n(new Pt(t, "Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."));
            }, s.onerror = e => {
                const s = e.target.error;
                "VersionError" === s.name ? n(new L(B.FAILED_PRECONDITION, "A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")) : "InvalidStateError" === s.name ? n(new L(B.FAILED_PRECONDITION, "Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: " + s)) : n(new Pt(t, s));
            }, s.onupgradeneeded = t => {
                C("SimpleDb", 'Database "' + this.name + '" requires upgrade from version:', t.oldVersion);
                const e = t.target.result;
                this.V.M(e, s.transaction, t.oldVersion, this.version).next((() => {
                    C("SimpleDb", "Database upgrade to version " + this.version + " complete");
                }));
            };
        }))), this.F && (this.db.onversionchange = t => this.F(t)), this.db;
    }
    B(t) {
        this.F = t, this.db && (this.db.onversionchange = e => t(e));
    }
    async runTransaction(t, e, n, s) {
        const i = "readonly" === e;
        let r = 0;
        for (;;) {
            ++r;
            try {
                this.db = await this.$(t);
                const e = Rt.open(this.db, t, i ? "readonly" : "readwrite", n), r = s(e).next((t => (e.P(), 
                t))).catch((t => (
                // Abort the transaction if there was an error.
                e.abort(t), At.reject(t)))).toPromise();
                // As noted above, errors are propagated by aborting the transaction. So
                // we swallow any error here to avoid the browser logging it as unhandled.
                return r.catch((() => {})), 
                // Wait for the transaction to complete (i.e. IndexedDb's onsuccess event to
                // fire), but still return the original transactionFnResult back to the
                // caller.
                await e.v, r;
            } catch (t) {
                const e = t, n = "FirebaseError" !== e.name && r < 3;
                // TODO(schmidt-sebastian): We could probably be smarter about this and
                // not retry exceptions that are likely unrecoverable (such as quota
                // exceeded errors).
                // Note: We cannot use an instanceof check for FirestoreException, since the
                // exception is wrapped in a generic error by our async/await handling.
                                if (C("SimpleDb", "Transaction failed with error:", e.message, "Retrying:", n), 
                this.close(), !n) return Promise.reject(e);
            }
        }
    }
    close() {
        this.db && this.db.close(), this.db = void 0;
    }
}

/**
 * A controller for iterating over a key range or index. It allows an iterate
 * callback to delete the currently-referenced object, or jump to a new key
 * within the key range or index.
 */ class bt {
    constructor(t) {
        this.L = t, this.q = !1, this.U = null;
    }
    get isDone() {
        return this.q;
    }
    get K() {
        return this.U;
    }
    set cursor(t) {
        this.L = t;
    }
    /**
     * This function can be called to stop iteration at any point.
     */    done() {
        this.q = !0;
    }
    /**
     * This function can be called to skip to that next key, which could be
     * an index or a primary key.
     */    G(t) {
        this.U = t;
    }
    /**
     * Delete the current cursor value from the object store.
     *
     * NOTE: You CANNOT do this with a keysOnly query.
     */    delete() {
        return Dt(this.L.delete());
    }
}

/** An error that wraps exceptions that thrown during IndexedDB execution. */ class Pt extends L {
    constructor(t, e) {
        super(B.UNAVAILABLE, `IndexedDB transaction '${t}' failed: ${e}`), this.name = "IndexedDbTransactionError";
    }
}

/** Verifies whether `e` is an IndexedDbTransactionError. */ function Vt(t) {
    // Use name equality, as instanceof checks on errors don't work with errors
    // that wrap other errors.
    return "IndexedDbTransactionError" === t.name;
}

/**
 * A wrapper around an IDBObjectStore providing an API that:
 *
 * 1) Has generic KeyType / ValueType parameters to provide strongly-typed
 * methods for acting against the object store.
 * 2) Deals with IndexedDB's onsuccess / onerror event callbacks, making every
 * method return a PersistencePromise instead.
 * 3) Provides a higher-level API to avoid needing to do excessive wrapping of
 * intermediate IndexedDB types (IDBCursorWithValue, etc.)
 */ class St {
    constructor(t) {
        this.store = t;
    }
    put(t, e) {
        let n;
        return void 0 !== e ? (C("SimpleDb", "PUT", this.store.name, t, e), n = this.store.put(e, t)) : (C("SimpleDb", "PUT", this.store.name, "<auto-key>", t), 
        n = this.store.put(t)), Dt(n);
    }
    /**
     * Adds a new value into an Object Store and returns the new key. Similar to
     * IndexedDb's `add()`, this method will fail on primary key collisions.
     *
     * @param value - The object to write.
     * @returns The key of the value to add.
     */    add(t) {
        C("SimpleDb", "ADD", this.store.name, t, t);
        return Dt(this.store.add(t));
    }
    /**
     * Gets the object with the specified key from the specified store, or null
     * if no object exists with the specified key.
     *
     * @key The key of the object to get.
     * @returns The object with the specified key or null if no object exists.
     */    get(t) {
        // We're doing an unsafe cast to ValueType.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Dt(this.store.get(t)).next((e => (
        // Normalize nonexistence to null.
        void 0 === e && (e = null), C("SimpleDb", "GET", this.store.name, t, e), e)));
    }
    delete(t) {
        C("SimpleDb", "DELETE", this.store.name, t);
        return Dt(this.store.delete(t));
    }
    /**
     * If we ever need more of the count variants, we can add overloads. For now,
     * all we need is to count everything in a store.
     *
     * Returns the number of rows in the store.
     */    count() {
        C("SimpleDb", "COUNT", this.store.name);
        return Dt(this.store.count());
    }
    j(t, e) {
        const n = this.options(t, e);
        // Use `getAll()` if the browser supports IndexedDB v3, as it is roughly
        // 20% faster. Unfortunately, getAll() does not support custom indices.
                if (n.index || "function" != typeof this.store.getAll) {
            const t = this.cursor(n), e = [];
            return this.W(t, ((t, n) => {
                e.push(n);
            })).next((() => e));
        }
        {
            const t = this.store.getAll(n.range);
            return new At(((e, n) => {
                t.onerror = t => {
                    n(t.target.error);
                }, t.onsuccess = t => {
                    e(t.target.result);
                };
            }));
        }
    }
    /**
     * Loads the first `count` elements from the provided index range. Loads all
     * elements if no limit is provided.
     */    H(t, e) {
        const n = this.store.getAll(t, null === e ? void 0 : e);
        return new At(((t, e) => {
            n.onerror = t => {
                e(t.target.error);
            }, n.onsuccess = e => {
                t(e.target.result);
            };
        }));
    }
    J(t, e) {
        C("SimpleDb", "DELETE ALL", this.store.name);
        const n = this.options(t, e);
        n.Y = !1;
        const s = this.cursor(n);
        return this.W(s, ((t, e, n) => n.delete()));
    }
    Z(t, e) {
        let n;
        e ? n = t : (n = {}, e = t);
        const s = this.cursor(n);
        return this.W(s, e);
    }
    /**
     * Iterates over a store, but waits for the given callback to complete for
     * each entry before iterating the next entry. This allows the callback to do
     * asynchronous work to determine if this iteration should continue.
     *
     * The provided callback should return `true` to continue iteration, and
     * `false` otherwise.
     */    X(t) {
        const e = this.cursor({});
        return new At(((n, s) => {
            e.onerror = t => {
                const e = xt(t.target.error);
                s(e);
            }, e.onsuccess = e => {
                const s = e.target.result;
                s ? t(s.primaryKey, s.value).next((t => {
                    t ? s.continue() : n();
                })) : n();
            };
        }));
    }
    W(t, e) {
        const n = [];
        return new At(((s, i) => {
            t.onerror = t => {
                i(t.target.error);
            }, t.onsuccess = t => {
                const i = t.target.result;
                if (!i) return void s();
                const r = new bt(i), o = e(i.primaryKey, i.value, r);
                if (o instanceof At) {
                    const t = o.catch((t => (r.done(), At.reject(t))));
                    n.push(t);
                }
                r.isDone ? s() : null === r.K ? i.continue() : i.continue(r.K);
            };
        })).next((() => At.waitFor(n)));
    }
    options(t, e) {
        let n;
        return void 0 !== t && ("string" == typeof t ? n = t : e = t), {
            index: n,
            range: e
        };
    }
    cursor(t) {
        let e = "next";
        if (t.reverse && (e = "prev"), t.index) {
            const n = this.store.index(t.index);
            return t.Y ? n.openKeyCursor(t.range, e) : n.openCursor(t.range, e);
        }
        return this.store.openCursor(t.range, e);
    }
}

/**
 * Wraps an IDBRequest in a PersistencePromise, using the onsuccess / onerror
 * handlers to resolve / reject the PersistencePromise as appropriate.
 */ function Dt(t) {
    return new At(((e, n) => {
        t.onsuccess = t => {
            const n = t.target.result;
            e(n);
        }, t.onerror = t => {
            const e = xt(t.target.error);
            n(e);
        };
    }));
}

// Guard so we only report the error once.
let Ct = !1;

function xt(t) {
    const e = vt.S(getUA());
    if (e >= 12.2 && e < 13) {
        const e = "An internal error was encountered in the Indexed Database server";
        if (t.message.indexOf(e) >= 0) {
            // Wrap error in a more descriptive one.
            const t = new L("internal", `IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${e}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);
            return Ct || (Ct = !0, 
            // Throw a global exception outside of this promise chain, for the user to
            // potentially catch.
            setTimeout((() => {
                throw t;
            }), 0)), t;
        }
    }
    return t;
}

/** This class is responsible for the scheduling of Index Backfiller. */
class Nt {
    constructor(t, e) {
        this.asyncQueue = t, this.tt = e, this.task = null;
    }
    start() {
        this.et(15e3);
    }
    stop() {
        this.task && (this.task.cancel(), this.task = null);
    }
    get started() {
        return null !== this.task;
    }
    et(t) {
        C("IndexBackiller", `Scheduled in ${t}ms`), this.task = this.asyncQueue.enqueueAfterDelay("index_backfill" /* TimerId.IndexBackfill */ , t, (async () => {
            this.task = null;
            try {
                C("IndexBackiller", `Documents written: ${await this.tt.nt()}`);
            } catch (t) {
                Vt(t) ? C("IndexBackiller", "Ignoring IndexedDB error during index backfill: ", t) : await Et(t);
            }
            await this.et(6e4);
        }));
    }
}

/** Implements the steps for backfilling indexes. */ class kt {
    constructor(
    /**
     * LocalStore provides access to IndexManager and LocalDocumentView.
     * These properties will update when the user changes. Consequently,
     * making a local copy of IndexManager and LocalDocumentView will require
     * updates over time. The simpler solution is to rely on LocalStore to have
     * an up-to-date references to IndexManager and LocalDocumentStore.
     */
    t, e) {
        this.localStore = t, this.persistence = e;
    }
    async nt(t = 50) {
        return this.persistence.runTransaction("Backfill Indexes", "readwrite-primary", (e => this.st(e, t)));
    }
    /** Writes index entries until the cap is reached. Returns the number of documents processed. */    st(t, e) {
        const n = new Set;
        let s = e, i = !0;
        return At.doWhile((() => !0 === i && s > 0), (() => this.localStore.indexManager.getNextCollectionGroupToUpdate(t).next((e => {
            if (null !== e && !n.has(e)) return C("IndexBackiller", `Processing collection: ${e}`), 
            this.it(t, e, s).next((t => {
                s -= t, n.add(e);
            }));
            i = !1;
        })))).next((() => e - s));
    }
    /**
     * Writes entries for the provided collection group. Returns the number of documents processed.
     */    it(t, e, n) {
        // Use the earliest offset of all field indexes to query the local cache.
        return this.localStore.indexManager.getMinOffsetFromCollectionGroup(t, e).next((s => this.localStore.localDocuments.getNextDocuments(t, e, s, n).next((n => {
            const i = n.changes;
            return this.localStore.indexManager.updateIndexEntries(t, i).next((() => this.rt(s, n))).next((n => (C("IndexBackiller", `Updating offset: ${n}`), 
            this.localStore.indexManager.updateCollectionGroup(t, e, n)))).next((() => i.size));
        }))));
    }
    /** Returns the next offset based on the provided documents. */    rt(t, e) {
        let n = t;
        return e.changes.forEach(((t, e) => {
            const s = gt(e);
            pt(s, n) > 0 && (n = s);
        })), new yt(n.readTime, n.documentKey, Math.max(e.batchId, t.largestBatchId));
    }
}

/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * `ListenSequence` is a monotonic sequence. It is initialized with a minimum value to
 * exceed. All subsequent calls to next will return increasing values. If provided with a
 * `SequenceNumberSyncer`, it will additionally bump its next value when told of a new value, as
 * well as write out sequence numbers that it produces via `next()`.
 */ class Ot {
    constructor(t, e) {
        this.previousValue = t, e && (e.sequenceNumberHandler = t => this.ot(t), this.ut = t => e.writeSequenceNumber(t));
    }
    ot(t) {
        return this.previousValue = Math.max(t, this.previousValue), this.previousValue;
    }
    next() {
        const t = ++this.previousValue;
        return this.ut && this.ut(t), t;
    }
}

Ot.ct = -1;

/**
 * Returns whether a variable is either undefined or null.
 */
function $t(t) {
    return null == t;
}

/** Returns whether the value represents -0. */ function Mt(t) {
    // Detect if the value is -0.0. Based on polyfill from
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
    return 0 === t && 1 / t == -1 / 0;
}

/**
 * Returns whether a value is an integer and in the safe integer range
 * @param value - The value to test for being an integer and in the safe range
 */ function Ft(t) {
    return "number" == typeof t && Number.isInteger(t) && !Mt(t) && t <= Number.MAX_SAFE_INTEGER && t >= Number.MIN_SAFE_INTEGER;
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Encodes a resource path into a IndexedDb-compatible string form.
 */
function Bt(t) {
    let e = "";
    for (let n = 0; n < t.length; n++) e.length > 0 && (e = qt(e)), e = Lt(t.get(n), e);
    return qt(e);
}

/** Encodes a single segment of a resource path into the given result */ function Lt(t, e) {
    let n = e;
    const s = t.length;
    for (let e = 0; e < s; e++) {
        const s = t.charAt(e);
        switch (s) {
          case "\0":
            n += "";
            break;

          case "":
            n += "";
            break;

          default:
            n += s;
        }
    }
    return n;
}

/** Encodes a path separator into the given result */ function qt(t) {
    return t + "";
}

/**
 * Decodes the given IndexedDb-compatible string form of a resource path into
 * a ResourcePath instance. Note that this method is not suitable for use with
 * decoding resource names from the server; those are One Platform format
 * strings.
 */ function Ut(t) {
    // Event the empty path must encode as a path of at least length 2. A path
    // with exactly 2 must be the empty path.
    const e = t.length;
    if ($(e >= 2), 2 === e) return $("" === t.charAt(0) && "" === t.charAt(1)), rt.emptyPath();
    // Escape characters cannot exist past the second-to-last position in the
    // source value.
        const __PRIVATE_lastReasonableEscapeIndex = e - 2, n = [];
    let s = "";
    for (let i = 0; i < e; ) {
        // The last two characters of a valid encoded path must be a separator, so
        // there must be an end to this segment.
        const e = t.indexOf("", i);
        (e < 0 || e > __PRIVATE_lastReasonableEscapeIndex) && O();
        switch (t.charAt(e + 1)) {
          case "":
            const r = t.substring(i, e);
            let o;
            0 === s.length ? 
            // Avoid copying for the common case of a segment that excludes \0
            // and \001
            o = r : (s += r, o = s, s = ""), n.push(o);
            break;

          case "":
            s += t.substring(i, e), s += "\0";
            break;

          case "":
            // The escape character can be used in the output to encode itself.
            s += t.substring(i, e + 1);
            break;

          default:
            O();
        }
        i = e + 2;
    }
    return new rt(n);
}

/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Kt = [ "userId", "batchId" ];

/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Name of the IndexedDb object store.
 *
 * Note that the name 'owner' is chosen to ensure backwards compatibility with
 * older clients that only supported single locked access to the persistence
 * layer.
 */
/**
 * Creates a [userId, encodedPath] key for use in the DbDocumentMutations
 * index to iterate over all at document mutations for a given path or lower.
 */
function Gt(t, e) {
    return [ t, Bt(e) ];
}

/**
 * Creates a full index key of [userId, encodedPath, batchId] for inserting
 * and deleting into the DbDocumentMutations index.
 */ function Qt(t, e, n) {
    return [ t, Bt(e), n ];
}

/**
 * Because we store all the useful information for this store in the key,
 * there is no useful information to store as the value. The raw (unencoded)
 * path cannot be stored because IndexedDb doesn't store prototype
 * information.
 */ const zt = {}, jt = [ "prefixPath", "collectionGroup", "readTime", "documentId" ], Wt = [ "prefixPath", "collectionGroup", "documentId" ], Ht = [ "collectionGroup", "readTime", "prefixPath", "documentId" ], Jt = [ "canonicalId", "targetId" ], Yt = [ "targetId", "path" ], Zt = [ "path", "targetId" ], Xt = [ "collectionId", "parent" ], te = [ "indexId", "uid" ], ee = [ "uid", "sequenceNumber" ], ne = [ "indexId", "uid", "arrayValue", "directionalValue", "orderedDocumentKey", "documentKey" ], se = [ "indexId", "uid", "orderedDocumentKey" ], ie = [ "userId", "collectionPath", "documentId" ], re = [ "userId", "collectionPath", "largestBatchId" ], oe = [ "userId", "collectionGroup", "largestBatchId" ], ue = [ ...[ ...[ ...[ ...[ "mutationQueues", "mutations", "documentMutations", "remoteDocuments", "targets", "owner", "targetGlobal", "targetDocuments" ], "clientMetadata" ], "remoteDocumentGlobal" ], "collectionParents" ], "bundles", "namedQueries" ], ce = [ ...ue, "documentOverlays" ], ae = [ "mutationQueues", "mutations", "documentMutations", "remoteDocumentsV14", "targets", "owner", "targetGlobal", "targetDocuments", "clientMetadata", "remoteDocumentGlobal", "collectionParents", "bundles", "namedQueries", "documentOverlays" ], he = ae, le = [ ...he, "indexConfiguration", "indexState", "indexEntries" ];

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class fe extends Tt {
    constructor(t, e) {
        super(), this.at = t, this.currentSequenceNumber = e;
    }
}

function de(t, e) {
    const n = F(t);
    return vt.O(n.at, e);
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function we(t) {
    let e = 0;
    for (const n in t) Object.prototype.hasOwnProperty.call(t, n) && e++;
    return e;
}

function _e(t, e) {
    for (const n in t) Object.prototype.hasOwnProperty.call(t, n) && e(n, t[n]);
}

function me(t) {
    for (const e in t) if (Object.prototype.hasOwnProperty.call(t, e)) return !1;
    return !0;
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// An immutable sorted map implementation, based on a Left-leaning Red-Black
// tree.
class ge {
    constructor(t, e) {
        this.comparator = t, this.root = e || pe.EMPTY;
    }
    // Returns a copy of the map, with the specified key/value added or replaced.
    insert(t, e) {
        return new ge(this.comparator, this.root.insert(t, e, this.comparator).copy(null, null, pe.BLACK, null, null));
    }
    // Returns a copy of the map, with the specified key removed.
    remove(t) {
        return new ge(this.comparator, this.root.remove(t, this.comparator).copy(null, null, pe.BLACK, null, null));
    }
    // Returns the value of the node with the given key, or null.
    get(t) {
        let e = this.root;
        for (;!e.isEmpty(); ) {
            const n = this.comparator(t, e.key);
            if (0 === n) return e.value;
            n < 0 ? e = e.left : n > 0 && (e = e.right);
        }
        return null;
    }
    // Returns the index of the element in this sorted map, or -1 if it doesn't
    // exist.
    indexOf(t) {
        // Number of nodes that were pruned when descending right
        let e = 0, n = this.root;
        for (;!n.isEmpty(); ) {
            const s = this.comparator(t, n.key);
            if (0 === s) return e + n.left.size;
            s < 0 ? n = n.left : (
            // Count all nodes left of the node plus the node itself
            e += n.left.size + 1, n = n.right);
        }
        // Node not found
                return -1;
    }
    isEmpty() {
        return this.root.isEmpty();
    }
    // Returns the total number of nodes in the map.
    get size() {
        return this.root.size;
    }
    // Returns the minimum key in the map.
    minKey() {
        return this.root.minKey();
    }
    // Returns the maximum key in the map.
    maxKey() {
        return this.root.maxKey();
    }
    // Traverses the map in key order and calls the specified action function
    // for each key/value pair. If action returns true, traversal is aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    inorderTraversal(t) {
        return this.root.inorderTraversal(t);
    }
    forEach(t) {
        this.inorderTraversal(((e, n) => (t(e, n), !1)));
    }
    toString() {
        const t = [];
        return this.inorderTraversal(((e, n) => (t.push(`${e}:${n}`), !1))), `{${t.join(", ")}}`;
    }
    // Traverses the map in reverse key order and calls the specified action
    // function for each key/value pair. If action returns true, traversal is
    // aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    reverseTraversal(t) {
        return this.root.reverseTraversal(t);
    }
    // Returns an iterator over the SortedMap.
    getIterator() {
        return new ye(this.root, null, this.comparator, !1);
    }
    getIteratorFrom(t) {
        return new ye(this.root, t, this.comparator, !1);
    }
    getReverseIterator() {
        return new ye(this.root, null, this.comparator, !0);
    }
    getReverseIteratorFrom(t) {
        return new ye(this.root, t, this.comparator, !0);
    }
}

 // end SortedMap
// An iterator over an LLRBNode.
class ye {
    constructor(t, e, n, s) {
        this.isReverse = s, this.nodeStack = [];
        let i = 1;
        for (;!t.isEmpty(); ) if (i = e ? n(t.key, e) : 1, 
        // flip the comparison if we're going in reverse
        e && s && (i *= -1), i < 0) 
        // This node is less than our start key. ignore it
        t = this.isReverse ? t.left : t.right; else {
            if (0 === i) {
                // This node is exactly equal to our start key. Push it on the stack,
                // but stop iterating;
                this.nodeStack.push(t);
                break;
            }
            // This node is greater than our start key, add it to the stack and move
            // to the next one
            this.nodeStack.push(t), t = this.isReverse ? t.right : t.left;
        }
    }
    getNext() {
        let t = this.nodeStack.pop();
        const e = {
            key: t.key,
            value: t.value
        };
        if (this.isReverse) for (t = t.left; !t.isEmpty(); ) this.nodeStack.push(t), t = t.right; else for (t = t.right; !t.isEmpty(); ) this.nodeStack.push(t), 
        t = t.left;
        return e;
    }
    hasNext() {
        return this.nodeStack.length > 0;
    }
    peek() {
        if (0 === this.nodeStack.length) return null;
        const t = this.nodeStack[this.nodeStack.length - 1];
        return {
            key: t.key,
            value: t.value
        };
    }
}

 // end SortedMapIterator
// Represents a node in a Left-leaning Red-Black tree.
class pe {
    constructor(t, e, n, s, i) {
        this.key = t, this.value = e, this.color = null != n ? n : pe.RED, this.left = null != s ? s : pe.EMPTY, 
        this.right = null != i ? i : pe.EMPTY, this.size = this.left.size + 1 + this.right.size;
    }
    // Returns a copy of the current node, optionally replacing pieces of it.
    copy(t, e, n, s, i) {
        return new pe(null != t ? t : this.key, null != e ? e : this.value, null != n ? n : this.color, null != s ? s : this.left, null != i ? i : this.right);
    }
    isEmpty() {
        return !1;
    }
    // Traverses the tree in key order and calls the specified action function
    // for each node. If action returns true, traversal is aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    inorderTraversal(t) {
        return this.left.inorderTraversal(t) || t(this.key, this.value) || this.right.inorderTraversal(t);
    }
    // Traverses the tree in reverse key order and calls the specified action
    // function for each node. If action returns true, traversal is aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    reverseTraversal(t) {
        return this.right.reverseTraversal(t) || t(this.key, this.value) || this.left.reverseTraversal(t);
    }
    // Returns the minimum node in the tree.
    min() {
        return this.left.isEmpty() ? this : this.left.min();
    }
    // Returns the maximum key in the tree.
    minKey() {
        return this.min().key;
    }
    // Returns the maximum key in the tree.
    maxKey() {
        return this.right.isEmpty() ? this.key : this.right.maxKey();
    }
    // Returns new tree, with the key/value added.
    insert(t, e, n) {
        let s = this;
        const i = n(t, s.key);
        return s = i < 0 ? s.copy(null, null, null, s.left.insert(t, e, n), null) : 0 === i ? s.copy(null, e, null, null, null) : s.copy(null, null, null, null, s.right.insert(t, e, n)), 
        s.fixUp();
    }
    removeMin() {
        if (this.left.isEmpty()) return pe.EMPTY;
        let t = this;
        return t.left.isRed() || t.left.left.isRed() || (t = t.moveRedLeft()), t = t.copy(null, null, null, t.left.removeMin(), null), 
        t.fixUp();
    }
    // Returns new tree, with the specified item removed.
    remove(t, e) {
        let n, s = this;
        if (e(t, s.key) < 0) s.left.isEmpty() || s.left.isRed() || s.left.left.isRed() || (s = s.moveRedLeft()), 
        s = s.copy(null, null, null, s.left.remove(t, e), null); else {
            if (s.left.isRed() && (s = s.rotateRight()), s.right.isEmpty() || s.right.isRed() || s.right.left.isRed() || (s = s.moveRedRight()), 
            0 === e(t, s.key)) {
                if (s.right.isEmpty()) return pe.EMPTY;
                n = s.right.min(), s = s.copy(n.key, n.value, null, null, s.right.removeMin());
            }
            s = s.copy(null, null, null, null, s.right.remove(t, e));
        }
        return s.fixUp();
    }
    isRed() {
        return this.color;
    }
    // Returns new tree after performing any needed rotations.
    fixUp() {
        let t = this;
        return t.right.isRed() && !t.left.isRed() && (t = t.rotateLeft()), t.left.isRed() && t.left.left.isRed() && (t = t.rotateRight()), 
        t.left.isRed() && t.right.isRed() && (t = t.colorFlip()), t;
    }
    moveRedLeft() {
        let t = this.colorFlip();
        return t.right.left.isRed() && (t = t.copy(null, null, null, null, t.right.rotateRight()), 
        t = t.rotateLeft(), t = t.colorFlip()), t;
    }
    moveRedRight() {
        let t = this.colorFlip();
        return t.left.left.isRed() && (t = t.rotateRight(), t = t.colorFlip()), t;
    }
    rotateLeft() {
        const t = this.copy(null, null, pe.RED, null, this.right.left);
        return this.right.copy(null, null, this.color, t, null);
    }
    rotateRight() {
        const t = this.copy(null, null, pe.RED, this.left.right, null);
        return this.left.copy(null, null, this.color, null, t);
    }
    colorFlip() {
        const t = this.left.copy(null, null, !this.left.color, null, null), e = this.right.copy(null, null, !this.right.color, null, null);
        return this.copy(null, null, !this.color, t, e);
    }
    // For testing.
    checkMaxDepth() {
        const t = this.check();
        return Math.pow(2, t) <= this.size + 1;
    }
    // In a balanced RB tree, the black-depth (number of black nodes) from root to
    // leaves is equal on both sides.  This function verifies that or asserts.
    check() {
        if (this.isRed() && this.left.isRed()) throw O();
        if (this.right.isRed()) throw O();
        const t = this.left.check();
        if (t !== this.right.check()) throw O();
        return t + (this.isRed() ? 0 : 1);
    }
}

 // end LLRBNode
// Empty node is shared between all LLRB trees.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
pe.EMPTY = null, pe.RED = !0, pe.BLACK = !1;

// end LLRBEmptyNode
pe.EMPTY = new 
// Represents an empty node (a leaf node in the Red-Black Tree).
class {
    constructor() {
        this.size = 0;
    }
    get key() {
        throw O();
    }
    get value() {
        throw O();
    }
    get color() {
        throw O();
    }
    get left() {
        throw O();
    }
    get right() {
        throw O();
    }
    // Returns a copy of the current node.
    copy(t, e, n, s, i) {
        return this;
    }
    // Returns a copy of the tree, with the specified key/value added.
    insert(t, e, n) {
        return new pe(t, e);
    }
    // Returns a copy of the tree, with the specified key removed.
    remove(t, e) {
        return this;
    }
    isEmpty() {
        return !0;
    }
    inorderTraversal(t) {
        return !1;
    }
    reverseTraversal(t) {
        return !1;
    }
    minKey() {
        return null;
    }
    maxKey() {
        return null;
    }
    isRed() {
        return !1;
    }
    // For testing.
    checkMaxDepth() {
        return !0;
    }
    check() {
        return 0;
    }
};

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * SortedSet is an immutable (copy-on-write) collection that holds elements
 * in order specified by the provided comparator.
 *
 * NOTE: if provided comparator returns 0 for two elements, we consider them to
 * be equal!
 */
class Ie {
    constructor(t) {
        this.comparator = t, this.data = new ge(this.comparator);
    }
    has(t) {
        return null !== this.data.get(t);
    }
    first() {
        return this.data.minKey();
    }
    last() {
        return this.data.maxKey();
    }
    get size() {
        return this.data.size;
    }
    indexOf(t) {
        return this.data.indexOf(t);
    }
    /** Iterates elements in order defined by "comparator" */    forEach(t) {
        this.data.inorderTraversal(((e, n) => (t(e), !1)));
    }
    /** Iterates over `elem`s such that: range[0] &lt;= elem &lt; range[1]. */    forEachInRange(t, e) {
        const n = this.data.getIteratorFrom(t[0]);
        for (;n.hasNext(); ) {
            const s = n.getNext();
            if (this.comparator(s.key, t[1]) >= 0) return;
            e(s.key);
        }
    }
    /**
     * Iterates over `elem`s such that: start &lt;= elem until false is returned.
     */    forEachWhile(t, e) {
        let n;
        for (n = void 0 !== e ? this.data.getIteratorFrom(e) : this.data.getIterator(); n.hasNext(); ) {
            if (!t(n.getNext().key)) return;
        }
    }
    /** Finds the least element greater than or equal to `elem`. */    firstAfterOrEqual(t) {
        const e = this.data.getIteratorFrom(t);
        return e.hasNext() ? e.getNext().key : null;
    }
    getIterator() {
        return new Te(this.data.getIterator());
    }
    getIteratorFrom(t) {
        return new Te(this.data.getIteratorFrom(t));
    }
    /** Inserts or updates an element */    add(t) {
        return this.copy(this.data.remove(t).insert(t, !0));
    }
    /** Deletes an element */    delete(t) {
        return this.has(t) ? this.copy(this.data.remove(t)) : this;
    }
    isEmpty() {
        return this.data.isEmpty();
    }
    unionWith(t) {
        let e = this;
        // Make sure `result` always refers to the larger one of the two sets.
                return e.size < t.size && (e = t, t = this), t.forEach((t => {
            e = e.add(t);
        })), e;
    }
    isEqual(t) {
        if (!(t instanceof Ie)) return !1;
        if (this.size !== t.size) return !1;
        const e = this.data.getIterator(), n = t.data.getIterator();
        for (;e.hasNext(); ) {
            const t = e.getNext().key, s = n.getNext().key;
            if (0 !== this.comparator(t, s)) return !1;
        }
        return !0;
    }
    toArray() {
        const t = [];
        return this.forEach((e => {
            t.push(e);
        })), t;
    }
    toString() {
        const t = [];
        return this.forEach((e => t.push(e))), "SortedSet(" + t.toString() + ")";
    }
    copy(t) {
        const e = new Ie(this.comparator);
        return e.data = t, e;
    }
}

class Te {
    constructor(t) {
        this.iter = t;
    }
    getNext() {
        return this.iter.getNext().key;
    }
    hasNext() {
        return this.iter.hasNext();
    }
}

/**
 * Compares two sorted sets for equality using their natural ordering. The
 * method computes the intersection and invokes `onAdd` for every element that
 * is in `after` but not `before`. `onRemove` is invoked for every element in
 * `before` but missing from `after`.
 *
 * The method creates a copy of both `before` and `after` and runs in O(n log
 * n), where n is the size of the two lists.
 *
 * @param before - The elements that exist in the original set.
 * @param after - The elements to diff against the original set.
 * @param comparator - The comparator for the elements in before and after.
 * @param onAdd - A function to invoke for every element that is part of `
 * after` but not `before`.
 * @param onRemove - A function to invoke for every element that is part of
 * `before` but not `after`.
 */
/**
 * Returns the next element from the iterator or `undefined` if none available.
 */
function Ee(t) {
    return t.hasNext() ? t.getNext() : void 0;
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Provides a set of fields that can be used to partially patch a document.
 * FieldMask is used in conjunction with ObjectValue.
 * Examples:
 *   foo - Overwrites foo entirely with the provided value. If foo is not
 *         present in the companion ObjectValue, the field is deleted.
 *   foo.bar - Overwrites only the field bar of the object foo.
 *             If foo is not an object, foo is replaced with an object
 *             containing foo
 */ class Ae {
    constructor(t) {
        this.fields = t, 
        // TODO(dimond): validation of FieldMask
        // Sort the field mask to support `FieldMask.isEqual()` and assert below.
        t.sort(ut.comparator);
    }
    static empty() {
        return new Ae([]);
    }
    /**
     * Returns a new FieldMask object that is the result of adding all the given
     * fields paths to this field mask.
     */    unionWith(t) {
        let e = new Ie(ut.comparator);
        for (const t of this.fields) e = e.add(t);
        for (const n of t) e = e.add(n);
        return new Ae(e.toArray());
    }
    /**
     * Verifies that `fieldPath` is included by at least one field in this field
     * mask.
     *
     * This is an O(n) operation, where `n` is the size of the field mask.
     */    covers(t) {
        for (const e of this.fields) if (e.isPrefixOf(t)) return !0;
        return !1;
    }
    isEqual(t) {
        return tt(this.fields, t.fields, ((t, e) => t.isEqual(e)));
    }
}

/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * An error encountered while decoding base64 string.
 */ class Re extends Error {
    constructor() {
        super(...arguments), this.name = "Base64DecodeError";
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** Converts a Base64 encoded string to a binary string. */
/** True if and only if the Base64 conversion functions are available. */
function ve() {
    return "undefined" != typeof atob;
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Immutable class that represents a "proto" byte string.
 *
 * Proto byte strings can either be Base64-encoded strings or Uint8Arrays when
 * sent on the wire. This class abstracts away this differentiation by holding
 * the proto byte string in a common class that must be converted into a string
 * before being sent as a proto.
 * @internal
 */ class be {
    constructor(t) {
        this.binaryString = t;
    }
    static fromBase64String(t) {
        const e = function(t) {
            try {
                return atob(t);
            } catch (t) {
                // Check that `DOMException` is defined before using it to avoid
                // "ReferenceError: Property 'DOMException' doesn't exist" in react-native.
                // (https://github.com/firebase/firebase-js-sdk/issues/7115)
                throw "undefined" != typeof DOMException && t instanceof DOMException ? new Re("Invalid base64 string: " + t) : t;
            }
        }
        /** Converts a binary string to a Base64 encoded string. */ (t);
        return new be(e);
    }
    static fromUint8Array(t) {
        // TODO(indexing); Remove the copy of the byte string here as this method
        // is frequently called during indexing.
        const e = 
        /**
 * Helper function to convert an Uint8array to a binary string.
 */
        function(t) {
            let e = "";
            for (let n = 0; n < t.length; ++n) e += String.fromCharCode(t[n]);
            return e;
        }
        /**
 * Helper function to convert a binary string to an Uint8Array.
 */ (t);
        return new be(e);
    }
    [Symbol.iterator]() {
        let t = 0;
        return {
            next: () => t < this.binaryString.length ? {
                value: this.binaryString.charCodeAt(t++),
                done: !1
            } : {
                value: void 0,
                done: !0
            }
        };
    }
    toBase64() {
        return t = this.binaryString, btoa(t);
        var t;
    }
    toUint8Array() {
        return function(t) {
            const e = new Uint8Array(t.length);
            for (let n = 0; n < t.length; n++) e[n] = t.charCodeAt(n);
            return e;
        }
        /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
        // A RegExp matching ISO 8601 UTC timestamps with optional fraction.
        (this.binaryString);
    }
    approximateByteSize() {
        return 2 * this.binaryString.length;
    }
    compareTo(t) {
        return X(this.binaryString, t.binaryString);
    }
    isEqual(t) {
        return this.binaryString === t.binaryString;
    }
}

be.EMPTY_BYTE_STRING = new be("");

const Pe = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);

/**
 * Converts the possible Proto values for a timestamp value into a "seconds and
 * nanos" representation.
 */ function Ve(t) {
    // The json interface (for the browser) will return an iso timestamp string,
    // while the proto js library (for node) will return a
    // google.protobuf.Timestamp instance.
    if ($(!!t), "string" == typeof t) {
        // The date string can have higher precision (nanos) than the Date class
        // (millis), so we do some custom parsing here.
        // Parse the nanos right out of the string.
        let e = 0;
        const n = Pe.exec(t);
        if ($(!!n), n[1]) {
            // Pad the fraction out to 9 digits (nanos).
            let t = n[1];
            t = (t + "000000000").substr(0, 9), e = Number(t);
        }
        // Parse the date to get the seconds.
                const s = new Date(t);
        return {
            seconds: Math.floor(s.getTime() / 1e3),
            nanos: e
        };
    }
    return {
        seconds: Se(t.seconds),
        nanos: Se(t.nanos)
    };
}

/**
 * Converts the possible Proto types for numbers into a JavaScript number.
 * Returns 0 if the value is not numeric.
 */ function Se(t) {
    // TODO(bjornick): Handle int64 greater than 53 bits.
    return "number" == typeof t ? t : "string" == typeof t ? Number(t) : 0;
}

/** Converts the possible Proto types for Blobs into a ByteString. */ function De(t) {
    return "string" == typeof t ? be.fromBase64String(t) : be.fromUint8Array(t);
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Represents a locally-applied ServerTimestamp.
 *
 * Server Timestamps are backed by MapValues that contain an internal field
 * `__type__` with a value of `server_timestamp`. The previous value and local
 * write time are stored in its `__previous_value__` and `__local_write_time__`
 * fields respectively.
 *
 * Notes:
 * - ServerTimestampValue instances are created as the result of applying a
 *   transform. They can only exist in the local view of a document. Therefore
 *   they do not need to be parsed or serialized.
 * - When evaluated locally (e.g. for snapshot.data()), they by default
 *   evaluate to `null`. This behavior can be configured by passing custom
 *   FieldValueOptions to value().
 * - With respect to other ServerTimestampValues, they sort by their
 *   localWriteTime.
 */ function Ce(t) {
    var e, n;
    return "server_timestamp" === (null === (n = ((null === (e = null == t ? void 0 : t.mapValue) || void 0 === e ? void 0 : e.fields) || {}).__type__) || void 0 === n ? void 0 : n.stringValue);
}

/**
 * Creates a new ServerTimestamp proto value (using the internal format).
 */
/**
 * Returns the value of the field before this ServerTimestamp was set.
 *
 * Preserving the previous values allows the user to display the last resoled
 * value until the backend responds with the timestamp.
 */
function xe(t) {
    const e = t.mapValue.fields.__previous_value__;
    return Ce(e) ? xe(e) : e;
}

/**
 * Returns the local time at which this timestamp was first set.
 */ function Ne(t) {
    const e = Ve(t.mapValue.fields.__local_write_time__.timestampValue);
    return new nt(e.seconds, e.nanos);
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class ke {
    /**
     * Constructs a DatabaseInfo using the provided host, databaseId and
     * persistenceKey.
     *
     * @param databaseId - The database to use.
     * @param appId - The Firebase App Id.
     * @param persistenceKey - A unique identifier for this Firestore's local
     * storage (used in conjunction with the databaseId).
     * @param host - The Firestore backend host to connect to.
     * @param ssl - Whether to use SSL when connecting.
     * @param forceLongPolling - Whether to use the forceLongPolling option
     * when using WebChannel as the network transport.
     * @param autoDetectLongPolling - Whether to use the detectBufferingProxy
     * option when using WebChannel as the network transport.
     * @param useFetchStreams Whether to use the Fetch API instead of
     * XMLHTTPRequest
     */
    constructor(t, e, n, s, i, r, o, u) {
        this.databaseId = t, this.appId = e, this.persistenceKey = n, this.host = s, this.ssl = i, 
        this.forceLongPolling = r, this.autoDetectLongPolling = o, this.useFetchStreams = u;
    }
}

/** The default database name for a project. */
/**
 * Represents the database ID a Firestore client is associated with.
 * @internal
 */
class Oe {
    constructor(t, e) {
        this.projectId = t, this.database = e || "(default)";
    }
    static empty() {
        return new Oe("", "");
    }
    get isDefaultDatabase() {
        return "(default)" === this.database;
    }
    isEqual(t) {
        return t instanceof Oe && t.projectId === this.projectId && t.database === this.database;
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const $e = {
    mapValue: {
        fields: {
            __type__: {
                stringValue: "__max__"
            }
        }
    }
}, Me = {
    nullValue: "NULL_VALUE"
};

/** Extracts the backend's type order for the provided value. */
function Fe(t) {
    return "nullValue" in t ? 0 /* TypeOrder.NullValue */ : "booleanValue" in t ? 1 /* TypeOrder.BooleanValue */ : "integerValue" in t || "doubleValue" in t ? 2 /* TypeOrder.NumberValue */ : "timestampValue" in t ? 3 /* TypeOrder.TimestampValue */ : "stringValue" in t ? 5 /* TypeOrder.StringValue */ : "bytesValue" in t ? 6 /* TypeOrder.BlobValue */ : "referenceValue" in t ? 7 /* TypeOrder.RefValue */ : "geoPointValue" in t ? 8 /* TypeOrder.GeoPointValue */ : "arrayValue" in t ? 9 /* TypeOrder.ArrayValue */ : "mapValue" in t ? Ce(t) ? 4 /* TypeOrder.ServerTimestampValue */ : Ze(t) ? 9007199254740991 /* TypeOrder.MaxValue */ : 10 /* TypeOrder.ObjectValue */ : O();
}

/** Tests `left` and `right` for equality based on the backend semantics. */ function Be(t, e) {
    if (t === e) return !0;
    const n = Fe(t);
    if (n !== Fe(e)) return !1;
    switch (n) {
      case 0 /* TypeOrder.NullValue */ :
      case 9007199254740991 /* TypeOrder.MaxValue */ :
        return !0;

      case 1 /* TypeOrder.BooleanValue */ :
        return t.booleanValue === e.booleanValue;

      case 4 /* TypeOrder.ServerTimestampValue */ :
        return Ne(t).isEqual(Ne(e));

      case 3 /* TypeOrder.TimestampValue */ :
        return function(t, e) {
            if ("string" == typeof t.timestampValue && "string" == typeof e.timestampValue && t.timestampValue.length === e.timestampValue.length) 
            // Use string equality for ISO 8601 timestamps
            return t.timestampValue === e.timestampValue;
            const n = Ve(t.timestampValue), s = Ve(e.timestampValue);
            return n.seconds === s.seconds && n.nanos === s.nanos;
        }(t, e);

      case 5 /* TypeOrder.StringValue */ :
        return t.stringValue === e.stringValue;

      case 6 /* TypeOrder.BlobValue */ :
        return function(t, e) {
            return De(t.bytesValue).isEqual(De(e.bytesValue));
        }(t, e);

      case 7 /* TypeOrder.RefValue */ :
        return t.referenceValue === e.referenceValue;

      case 8 /* TypeOrder.GeoPointValue */ :
        return function(t, e) {
            return Se(t.geoPointValue.latitude) === Se(e.geoPointValue.latitude) && Se(t.geoPointValue.longitude) === Se(e.geoPointValue.longitude);
        }(t, e);

      case 2 /* TypeOrder.NumberValue */ :
        return function(t, e) {
            if ("integerValue" in t && "integerValue" in e) return Se(t.integerValue) === Se(e.integerValue);
            if ("doubleValue" in t && "doubleValue" in e) {
                const n = Se(t.doubleValue), s = Se(e.doubleValue);
                return n === s ? Mt(n) === Mt(s) : isNaN(n) && isNaN(s);
            }
            return !1;
        }(t, e);

      case 9 /* TypeOrder.ArrayValue */ :
        return tt(t.arrayValue.values || [], e.arrayValue.values || [], Be);

      case 10 /* TypeOrder.ObjectValue */ :
        return function(t, e) {
            const n = t.mapValue.fields || {}, s = e.mapValue.fields || {};
            if (we(n) !== we(s)) return !1;
            for (const t in n) if (n.hasOwnProperty(t) && (void 0 === s[t] || !Be(n[t], s[t]))) return !1;
            return !0;
        }
        /** Returns true if the ArrayValue contains the specified element. */ (t, e);

      default:
        return O();
    }
}

function Le(t, e) {
    return void 0 !== (t.values || []).find((t => Be(t, e)));
}

function qe(t, e) {
    if (t === e) return 0;
    const n = Fe(t), s = Fe(e);
    if (n !== s) return X(n, s);
    switch (n) {
      case 0 /* TypeOrder.NullValue */ :
      case 9007199254740991 /* TypeOrder.MaxValue */ :
        return 0;

      case 1 /* TypeOrder.BooleanValue */ :
        return X(t.booleanValue, e.booleanValue);

      case 2 /* TypeOrder.NumberValue */ :
        return function(t, e) {
            const n = Se(t.integerValue || t.doubleValue), s = Se(e.integerValue || e.doubleValue);
            return n < s ? -1 : n > s ? 1 : n === s ? 0 : 
            // one or both are NaN.
            isNaN(n) ? isNaN(s) ? 0 : -1 : 1;
        }(t, e);

      case 3 /* TypeOrder.TimestampValue */ :
        return Ue(t.timestampValue, e.timestampValue);

      case 4 /* TypeOrder.ServerTimestampValue */ :
        return Ue(Ne(t), Ne(e));

      case 5 /* TypeOrder.StringValue */ :
        return X(t.stringValue, e.stringValue);

      case 6 /* TypeOrder.BlobValue */ :
        return function(t, e) {
            const n = De(t), s = De(e);
            return n.compareTo(s);
        }(t.bytesValue, e.bytesValue);

      case 7 /* TypeOrder.RefValue */ :
        return function(t, e) {
            const n = t.split("/"), s = e.split("/");
            for (let t = 0; t < n.length && t < s.length; t++) {
                const e = X(n[t], s[t]);
                if (0 !== e) return e;
            }
            return X(n.length, s.length);
        }(t.referenceValue, e.referenceValue);

      case 8 /* TypeOrder.GeoPointValue */ :
        return function(t, e) {
            const n = X(Se(t.latitude), Se(e.latitude));
            if (0 !== n) return n;
            return X(Se(t.longitude), Se(e.longitude));
        }(t.geoPointValue, e.geoPointValue);

      case 9 /* TypeOrder.ArrayValue */ :
        return function(t, e) {
            const n = t.values || [], s = e.values || [];
            for (let t = 0; t < n.length && t < s.length; ++t) {
                const e = qe(n[t], s[t]);
                if (e) return e;
            }
            return X(n.length, s.length);
        }(t.arrayValue, e.arrayValue);

      case 10 /* TypeOrder.ObjectValue */ :
        return function(t, e) {
            if (t === $e.mapValue && e === $e.mapValue) return 0;
            if (t === $e.mapValue) return 1;
            if (e === $e.mapValue) return -1;
            const n = t.fields || {}, s = Object.keys(n), i = e.fields || {}, r = Object.keys(i);
            // Even though MapValues are likely sorted correctly based on their insertion
            // order (e.g. when received from the backend), local modifications can bring
            // elements out of order. We need to re-sort the elements to ensure that
            // canonical IDs are independent of insertion order.
            s.sort(), r.sort();
            for (let t = 0; t < s.length && t < r.length; ++t) {
                const e = X(s[t], r[t]);
                if (0 !== e) return e;
                const o = qe(n[s[t]], i[r[t]]);
                if (0 !== o) return o;
            }
            return X(s.length, r.length);
        }
        /**
 * Generates the canonical ID for the provided field value (as used in Target
 * serialization).
 */ (t.mapValue, e.mapValue);

      default:
        throw O();
    }
}

function Ue(t, e) {
    if ("string" == typeof t && "string" == typeof e && t.length === e.length) return X(t, e);
    const n = Ve(t), s = Ve(e), i = X(n.seconds, s.seconds);
    return 0 !== i ? i : X(n.nanos, s.nanos);
}

function Ke(t) {
    return Ge(t);
}

function Ge(t) {
    return "nullValue" in t ? "null" : "booleanValue" in t ? "" + t.booleanValue : "integerValue" in t ? "" + t.integerValue : "doubleValue" in t ? "" + t.doubleValue : "timestampValue" in t ? function(t) {
        const e = Ve(t);
        return `time(${e.seconds},${e.nanos})`;
    }(t.timestampValue) : "stringValue" in t ? t.stringValue : "bytesValue" in t ? De(t.bytesValue).toBase64() : "referenceValue" in t ? (n = t.referenceValue, 
    ct.fromName(n).toString()) : "geoPointValue" in t ? `geo(${(e = t.geoPointValue).latitude},${e.longitude})` : "arrayValue" in t ? function(t) {
        let e = "[", n = !0;
        for (const s of t.values || []) n ? n = !1 : e += ",", e += Ge(s);
        return e + "]";
    }
    /** Returns a reference value for the provided database and key. */ (t.arrayValue) : "mapValue" in t ? function(t) {
        // Iteration order in JavaScript is not guaranteed. To ensure that we generate
        // matching canonical IDs for identical maps, we need to sort the keys.
        const e = Object.keys(t.fields || {}).sort();
        let n = "{", s = !0;
        for (const i of e) s ? s = !1 : n += ",", n += `${i}:${Ge(t.fields[i])}`;
        return n + "}";
    }(t.mapValue) : O();
    var e, n;
}

function Qe(t, e) {
    return {
        referenceValue: `projects/${t.projectId}/databases/${t.database}/documents/${e.path.canonicalString()}`
    };
}

/** Returns true if `value` is an IntegerValue . */ function ze(t) {
    return !!t && "integerValue" in t;
}

/** Returns true if `value` is a DoubleValue. */
/** Returns true if `value` is an ArrayValue. */
function je(t) {
    return !!t && "arrayValue" in t;
}

/** Returns true if `value` is a NullValue. */ function We(t) {
    return !!t && "nullValue" in t;
}

/** Returns true if `value` is NaN. */ function He(t) {
    return !!t && "doubleValue" in t && isNaN(Number(t.doubleValue));
}

/** Returns true if `value` is a MapValue. */ function Je(t) {
    return !!t && "mapValue" in t;
}

/** Creates a deep copy of `source`. */ function Ye(t) {
    if (t.geoPointValue) return {
        geoPointValue: Object.assign({}, t.geoPointValue)
    };
    if (t.timestampValue && "object" == typeof t.timestampValue) return {
        timestampValue: Object.assign({}, t.timestampValue)
    };
    if (t.mapValue) {
        const e = {
            mapValue: {
                fields: {}
            }
        };
        return _e(t.mapValue.fields, ((t, n) => e.mapValue.fields[t] = Ye(n))), e;
    }
    if (t.arrayValue) {
        const e = {
            arrayValue: {
                values: []
            }
        };
        for (let n = 0; n < (t.arrayValue.values || []).length; ++n) e.arrayValue.values[n] = Ye(t.arrayValue.values[n]);
        return e;
    }
    return Object.assign({}, t);
}

/** Returns true if the Value represents the canonical {@link #MAX_VALUE} . */ function Ze(t) {
    return "__max__" === (((t.mapValue || {}).fields || {}).__type__ || {}).stringValue;
}

/** Returns the lowest value for the given value type (inclusive). */ function Xe(t) {
    return "nullValue" in t ? Me : "booleanValue" in t ? {
        booleanValue: !1
    } : "integerValue" in t || "doubleValue" in t ? {
        doubleValue: NaN
    } : "timestampValue" in t ? {
        timestampValue: {
            seconds: Number.MIN_SAFE_INTEGER
        }
    } : "stringValue" in t ? {
        stringValue: ""
    } : "bytesValue" in t ? {
        bytesValue: ""
    } : "referenceValue" in t ? Qe(Oe.empty(), ct.empty()) : "geoPointValue" in t ? {
        geoPointValue: {
            latitude: -90,
            longitude: -180
        }
    } : "arrayValue" in t ? {
        arrayValue: {}
    } : "mapValue" in t ? {
        mapValue: {}
    } : O();
}

/** Returns the largest value for the given value type (exclusive). */ function tn(t) {
    return "nullValue" in t ? {
        booleanValue: !1
    } : "booleanValue" in t ? {
        doubleValue: NaN
    } : "integerValue" in t || "doubleValue" in t ? {
        timestampValue: {
            seconds: Number.MIN_SAFE_INTEGER
        }
    } : "timestampValue" in t ? {
        stringValue: ""
    } : "stringValue" in t ? {
        bytesValue: ""
    } : "bytesValue" in t ? Qe(Oe.empty(), ct.empty()) : "referenceValue" in t ? {
        geoPointValue: {
            latitude: -90,
            longitude: -180
        }
    } : "geoPointValue" in t ? {
        arrayValue: {}
    } : "arrayValue" in t ? {
        mapValue: {}
    } : "mapValue" in t ? $e : O();
}

function en(t, e) {
    const n = qe(t.value, e.value);
    return 0 !== n ? n : t.inclusive && !e.inclusive ? -1 : !t.inclusive && e.inclusive ? 1 : 0;
}

function nn(t, e) {
    const n = qe(t.value, e.value);
    return 0 !== n ? n : t.inclusive && !e.inclusive ? 1 : !t.inclusive && e.inclusive ? -1 : 0;
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * An ObjectValue represents a MapValue in the Firestore Proto and offers the
 * ability to add and remove fields (via the ObjectValueBuilder).
 */ class sn {
    constructor(t) {
        this.value = t;
    }
    static empty() {
        return new sn({
            mapValue: {}
        });
    }
    /**
     * Returns the value at the given path or null.
     *
     * @param path - the path to search
     * @returns The value at the path or null if the path is not set.
     */    field(t) {
        if (t.isEmpty()) return this.value;
        {
            let e = this.value;
            for (let n = 0; n < t.length - 1; ++n) if (e = (e.mapValue.fields || {})[t.get(n)], 
            !Je(e)) return null;
            return e = (e.mapValue.fields || {})[t.lastSegment()], e || null;
        }
    }
    /**
     * Sets the field to the provided value.
     *
     * @param path - The field path to set.
     * @param value - The value to set.
     */    set(t, e) {
        this.getFieldsMap(t.popLast())[t.lastSegment()] = Ye(e);
    }
    /**
     * Sets the provided fields to the provided values.
     *
     * @param data - A map of fields to values (or null for deletes).
     */    setAll(t) {
        let e = ut.emptyPath(), n = {}, s = [];
        t.forEach(((t, i) => {
            if (!e.isImmediateParentOf(i)) {
                // Insert the accumulated changes at this parent location
                const t = this.getFieldsMap(e);
                this.applyChanges(t, n, s), n = {}, s = [], e = i.popLast();
            }
            t ? n[i.lastSegment()] = Ye(t) : s.push(i.lastSegment());
        }));
        const i = this.getFieldsMap(e);
        this.applyChanges(i, n, s);
    }
    /**
     * Removes the field at the specified path. If there is no field at the
     * specified path, nothing is changed.
     *
     * @param path - The field path to remove.
     */    delete(t) {
        const e = this.field(t.popLast());
        Je(e) && e.mapValue.fields && delete e.mapValue.fields[t.lastSegment()];
    }
    isEqual(t) {
        return Be(this.value, t.value);
    }
    /**
     * Returns the map that contains the leaf element of `path`. If the parent
     * entry does not yet exist, or if it is not a map, a new map will be created.
     */    getFieldsMap(t) {
        let e = this.value;
        e.mapValue.fields || (e.mapValue = {
            fields: {}
        });
        for (let n = 0; n < t.length; ++n) {
            let s = e.mapValue.fields[t.get(n)];
            Je(s) && s.mapValue.fields || (s = {
                mapValue: {
                    fields: {}
                }
            }, e.mapValue.fields[t.get(n)] = s), e = s;
        }
        return e.mapValue.fields;
    }
    /**
     * Modifies `fieldsMap` by adding, replacing or deleting the specified
     * entries.
     */    applyChanges(t, e, n) {
        _e(e, ((e, n) => t[e] = n));
        for (const e of n) delete t[e];
    }
    clone() {
        return new sn(Ye(this.value));
    }
}

/**
 * Returns a FieldMask built from all fields in a MapValue.
 */ function rn(t) {
    const e = [];
    return _e(t.fields, ((t, n) => {
        const s = new ut([ t ]);
        if (Je(n)) {
            const t = rn(n.mapValue).fields;
            if (0 === t.length) 
            // Preserve the empty map by adding it to the FieldMask.
            e.push(s); else 
            // For nested and non-empty ObjectValues, add the FieldPath of the
            // leaf nodes.
            for (const n of t) e.push(s.child(n));
        } else 
        // For nested and non-empty ObjectValues, add the FieldPath of the leaf
        // nodes.
        e.push(s);
    })), new Ae(e);
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Represents a document in Firestore with a key, version, data and whether it
 * has local mutations applied to it.
 *
 * Documents can transition between states via `convertToFoundDocument()`,
 * `convertToNoDocument()` and `convertToUnknownDocument()`. If a document does
 * not transition to one of these states even after all mutations have been
 * applied, `isValidDocument()` returns false and the document should be removed
 * from all views.
 */ class on {
    constructor(t, e, n, s, i, r, o) {
        this.key = t, this.documentType = e, this.version = n, this.readTime = s, this.createTime = i, 
        this.data = r, this.documentState = o;
    }
    /**
     * Creates a document with no known version or data, but which can serve as
     * base document for mutations.
     */    static newInvalidDocument(t) {
        return new on(t, 0 /* DocumentType.INVALID */ , 
        /* version */ st.min(), 
        /* readTime */ st.min(), 
        /* createTime */ st.min(), sn.empty(), 0 /* DocumentState.SYNCED */);
    }
    /**
     * Creates a new document that is known to exist with the given data at the
     * given version.
     */    static newFoundDocument(t, e, n, s) {
        return new on(t, 1 /* DocumentType.FOUND_DOCUMENT */ , 
        /* version */ e, 
        /* readTime */ st.min(), 
        /* createTime */ n, s, 0 /* DocumentState.SYNCED */);
    }
    /** Creates a new document that is known to not exist at the given version. */    static newNoDocument(t, e) {
        return new on(t, 2 /* DocumentType.NO_DOCUMENT */ , 
        /* version */ e, 
        /* readTime */ st.min(), 
        /* createTime */ st.min(), sn.empty(), 0 /* DocumentState.SYNCED */);
    }
    /**
     * Creates a new document that is known to exist at the given version but
     * whose data is not known (e.g. a document that was updated without a known
     * base document).
     */    static newUnknownDocument(t, e) {
        return new on(t, 3 /* DocumentType.UNKNOWN_DOCUMENT */ , 
        /* version */ e, 
        /* readTime */ st.min(), 
        /* createTime */ st.min(), sn.empty(), 2 /* DocumentState.HAS_COMMITTED_MUTATIONS */);
    }
    /**
     * Changes the document type to indicate that it exists and that its version
     * and data are known.
     */    convertToFoundDocument(t, e) {
        // If a document is switching state from being an invalid or deleted
        // document to a valid (FOUND_DOCUMENT) document, either due to receiving an
        // update from Watch or due to applying a local set mutation on top
        // of a deleted document, our best guess about its createTime would be the
        // version at which the document transitioned to a FOUND_DOCUMENT.
        return !this.createTime.isEqual(st.min()) || 2 /* DocumentType.NO_DOCUMENT */ !== this.documentType && 0 /* DocumentType.INVALID */ !== this.documentType || (this.createTime = t), 
        this.version = t, this.documentType = 1 /* DocumentType.FOUND_DOCUMENT */ , this.data = e, 
        this.documentState = 0 /* DocumentState.SYNCED */ , this;
    }
    /**
     * Changes the document type to indicate that it doesn't exist at the given
     * version.
     */    convertToNoDocument(t) {
        return this.version = t, this.documentType = 2 /* DocumentType.NO_DOCUMENT */ , 
        this.data = sn.empty(), this.documentState = 0 /* DocumentState.SYNCED */ , this;
    }
    /**
     * Changes the document type to indicate that it exists at a given version but
     * that its data is not known (e.g. a document that was updated without a known
     * base document).
     */    convertToUnknownDocument(t) {
        return this.version = t, this.documentType = 3 /* DocumentType.UNKNOWN_DOCUMENT */ , 
        this.data = sn.empty(), this.documentState = 2 /* DocumentState.HAS_COMMITTED_MUTATIONS */ , 
        this;
    }
    setHasCommittedMutations() {
        return this.documentState = 2 /* DocumentState.HAS_COMMITTED_MUTATIONS */ , this;
    }
    setHasLocalMutations() {
        return this.documentState = 1 /* DocumentState.HAS_LOCAL_MUTATIONS */ , this.version = st.min(), 
        this;
    }
    setReadTime(t) {
        return this.readTime = t, this;
    }
    get hasLocalMutations() {
        return 1 /* DocumentState.HAS_LOCAL_MUTATIONS */ === this.documentState;
    }
    get hasCommittedMutations() {
        return 2 /* DocumentState.HAS_COMMITTED_MUTATIONS */ === this.documentState;
    }
    get hasPendingWrites() {
        return this.hasLocalMutations || this.hasCommittedMutations;
    }
    isValidDocument() {
        return 0 /* DocumentType.INVALID */ !== this.documentType;
    }
    isFoundDocument() {
        return 1 /* DocumentType.FOUND_DOCUMENT */ === this.documentType;
    }
    isNoDocument() {
        return 2 /* DocumentType.NO_DOCUMENT */ === this.documentType;
    }
    isUnknownDocument() {
        return 3 /* DocumentType.UNKNOWN_DOCUMENT */ === this.documentType;
    }
    isEqual(t) {
        return t instanceof on && this.key.isEqual(t.key) && this.version.isEqual(t.version) && this.documentType === t.documentType && this.documentState === t.documentState && this.data.isEqual(t.data);
    }
    mutableCopy() {
        return new on(this.key, this.documentType, this.version, this.readTime, this.createTime, this.data.clone(), this.documentState);
    }
    toString() {
        return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
    }
}

/**
 * Compares the value for field `field` in the provided documents. Throws if
 * the field does not exist in both documents.
 */
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Represents a bound of a query.
 *
 * The bound is specified with the given components representing a position and
 * whether it's just before or just after the position (relative to whatever the
 * query order is).
 *
 * The position represents a logical index position for a query. It's a prefix
 * of values for the (potentially implicit) order by clauses of a query.
 *
 * Bound provides a function to determine whether a document comes before or
 * after a bound. This is influenced by whether the position is just before or
 * just after the provided values.
 */
class un {
    constructor(t, e) {
        this.position = t, this.inclusive = e;
    }
}

function cn(t, e, n) {
    let s = 0;
    for (let i = 0; i < t.position.length; i++) {
        const r = e[i], o = t.position[i];
        if (r.field.isKeyField()) s = ct.comparator(ct.fromName(o.referenceValue), n.key); else {
            s = qe(o, n.data.field(r.field));
        }
        if ("desc" /* Direction.DESCENDING */ === r.dir && (s *= -1), 0 !== s) break;
    }
    return s;
}

/**
 * Returns true if a document sorts after a bound using the provided sort
 * order.
 */ function an(t, e) {
    if (null === t) return null === e;
    if (null === e) return !1;
    if (t.inclusive !== e.inclusive || t.position.length !== e.position.length) return !1;
    for (let n = 0; n < t.position.length; n++) {
        if (!Be(t.position[n], e.position[n])) return !1;
    }
    return !0;
}

/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * An ordering on a field, in some Direction. Direction defaults to ASCENDING.
 */ class hn {
    constructor(t, e = "asc" /* Direction.ASCENDING */) {
        this.field = t, this.dir = e;
    }
}

function ln(t, e) {
    return t.dir === e.dir && t.field.isEqual(e.field);
}

/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class fn {}

class dn extends fn {
    constructor(t, e, n) {
        super(), this.field = t, this.op = e, this.value = n;
    }
    /**
     * Creates a filter based on the provided arguments.
     */    static create(t, e, n) {
        return t.isKeyField() ? "in" /* Operator.IN */ === e || "not-in" /* Operator.NOT_IN */ === e ? this.createKeyFieldInFilter(t, e, n) : new An(t, e, n) : "array-contains" /* Operator.ARRAY_CONTAINS */ === e ? new Pn(t, n) : "in" /* Operator.IN */ === e ? new Vn(t, n) : "not-in" /* Operator.NOT_IN */ === e ? new Sn(t, n) : "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ === e ? new Dn(t, n) : new dn(t, e, n);
    }
    static createKeyFieldInFilter(t, e, n) {
        return "in" /* Operator.IN */ === e ? new Rn(t, n) : new vn(t, n);
    }
    matches(t) {
        const e = t.data.field(this.field);
        // Types do not have to match in NOT_EQUAL filters.
                return "!=" /* Operator.NOT_EQUAL */ === this.op ? null !== e && this.matchesComparison(qe(e, this.value)) : null !== e && Fe(this.value) === Fe(e) && this.matchesComparison(qe(e, this.value));
        // Only compare types with matching backend order (such as double and int).
        }
    matchesComparison(t) {
        switch (this.op) {
          case "<" /* Operator.LESS_THAN */ :
            return t < 0;

          case "<=" /* Operator.LESS_THAN_OR_EQUAL */ :
            return t <= 0;

          case "==" /* Operator.EQUAL */ :
            return 0 === t;

          case "!=" /* Operator.NOT_EQUAL */ :
            return 0 !== t;

          case ">" /* Operator.GREATER_THAN */ :
            return t > 0;

          case ">=" /* Operator.GREATER_THAN_OR_EQUAL */ :
            return t >= 0;

          default:
            return O();
        }
    }
    isInequality() {
        return [ "<" /* Operator.LESS_THAN */ , "<=" /* Operator.LESS_THAN_OR_EQUAL */ , ">" /* Operator.GREATER_THAN */ , ">=" /* Operator.GREATER_THAN_OR_EQUAL */ , "!=" /* Operator.NOT_EQUAL */ , "not-in" /* Operator.NOT_IN */ ].indexOf(this.op) >= 0;
    }
    getFlattenedFilters() {
        return [ this ];
    }
    getFilters() {
        return [ this ];
    }
    getFirstInequalityField() {
        return this.isInequality() ? this.field : null;
    }
}

class wn extends fn {
    constructor(t, e) {
        super(), this.filters = t, this.op = e, this.ht = null;
    }
    /**
     * Creates a filter based on the provided arguments.
     */    static create(t, e) {
        return new wn(t, e);
    }
    matches(t) {
        return _n(this) ? void 0 === this.filters.find((e => !e.matches(t))) : void 0 !== this.filters.find((e => e.matches(t)));
    }
    getFlattenedFilters() {
        return null !== this.ht || (this.ht = this.filters.reduce(((t, e) => t.concat(e.getFlattenedFilters())), [])), 
        this.ht;
    }
    // Returns a mutable copy of `this.filters`
    getFilters() {
        return Object.assign([], this.filters);
    }
    getFirstInequalityField() {
        const t = this.lt((t => t.isInequality()));
        return null !== t ? t.field : null;
    }
    // Performs a depth-first search to find and return the first FieldFilter in the composite filter
    // that satisfies the predicate. Returns `null` if none of the FieldFilters satisfy the
    // predicate.
    lt(t) {
        for (const e of this.getFlattenedFilters()) if (t(e)) return e;
        return null;
    }
}

function _n(t) {
    return "and" /* CompositeOperator.AND */ === t.op;
}

function mn(t) {
    return "or" /* CompositeOperator.OR */ === t.op;
}

/**
 * Returns true if this filter is a conjunction of field filters only. Returns false otherwise.
 */ function gn(t) {
    return yn(t) && _n(t);
}

/**
 * Returns true if this filter does not contain any composite filters. Returns false otherwise.
 */ function yn(t) {
    for (const e of t.filters) if (e instanceof wn) return !1;
    return !0;
}

function pn(t) {
    if (t instanceof dn) 
    // TODO(b/29183165): Technically, this won't be unique if two values have
    // the same description, such as the int 3 and the string "3". So we should
    // add the types in here somehow, too.
    return t.field.canonicalString() + t.op.toString() + Ke(t.value);
    if (gn(t)) 
    // Older SDK versions use an implicit AND operation between their filters.
    // In the new SDK versions, the developer may use an explicit AND filter.
    // To stay consistent with the old usages, we add a special case to ensure
    // the canonical ID for these two are the same. For example:
    // `col.whereEquals("a", 1).whereEquals("b", 2)` should have the same
    // canonical ID as `col.where(and(equals("a",1), equals("b",2)))`.
    return t.filters.map((t => pn(t))).join(",");
    {
        // filter instanceof CompositeFilter
        const e = t.filters.map((t => pn(t))).join(",");
        return `${t.op}(${e})`;
    }
}

function In(t, e) {
    return t instanceof dn ? function(t, e) {
        return e instanceof dn && t.op === e.op && t.field.isEqual(e.field) && Be(t.value, e.value);
    }(t, e) : t instanceof wn ? function(t, e) {
        if (e instanceof wn && t.op === e.op && t.filters.length === e.filters.length) {
            return t.filters.reduce(((t, n, s) => t && In(n, e.filters[s])), !0);
        }
        return !1;
    }
    /**
 * Returns a new composite filter that contains all filter from
 * `compositeFilter` plus all the given filters in `otherFilters`.
 */ (t, e) : void O();
}

function Tn(t, e) {
    const n = t.filters.concat(e);
    return wn.create(n, t.op);
}

/** Returns a debug description for `filter`. */ function En(t) {
    return t instanceof dn ? function(t) {
        return `${t.field.canonicalString()} ${t.op} ${Ke(t.value)}`;
    }
    /** Filter that matches on key fields (i.e. '__name__'). */ (t) : t instanceof wn ? function(t) {
        return t.op.toString() + " {" + t.getFilters().map(En).join(" ,") + "}";
    }(t) : "Filter";
}

class An extends dn {
    constructor(t, e, n) {
        super(t, e, n), this.key = ct.fromName(n.referenceValue);
    }
    matches(t) {
        const e = ct.comparator(t.key, this.key);
        return this.matchesComparison(e);
    }
}

/** Filter that matches on key fields within an array. */ class Rn extends dn {
    constructor(t, e) {
        super(t, "in" /* Operator.IN */ , e), this.keys = bn("in" /* Operator.IN */ , e);
    }
    matches(t) {
        return this.keys.some((e => e.isEqual(t.key)));
    }
}

/** Filter that matches on key fields not present within an array. */ class vn extends dn {
    constructor(t, e) {
        super(t, "not-in" /* Operator.NOT_IN */ , e), this.keys = bn("not-in" /* Operator.NOT_IN */ , e);
    }
    matches(t) {
        return !this.keys.some((e => e.isEqual(t.key)));
    }
}

function bn(t, e) {
    var n;
    return ((null === (n = e.arrayValue) || void 0 === n ? void 0 : n.values) || []).map((t => ct.fromName(t.referenceValue)));
}

/** A Filter that implements the array-contains operator. */ class Pn extends dn {
    constructor(t, e) {
        super(t, "array-contains" /* Operator.ARRAY_CONTAINS */ , e);
    }
    matches(t) {
        const e = t.data.field(this.field);
        return je(e) && Le(e.arrayValue, this.value);
    }
}

/** A Filter that implements the IN operator. */ class Vn extends dn {
    constructor(t, e) {
        super(t, "in" /* Operator.IN */ , e);
    }
    matches(t) {
        const e = t.data.field(this.field);
        return null !== e && Le(this.value.arrayValue, e);
    }
}

/** A Filter that implements the not-in operator. */ class Sn extends dn {
    constructor(t, e) {
        super(t, "not-in" /* Operator.NOT_IN */ , e);
    }
    matches(t) {
        if (Le(this.value.arrayValue, {
            nullValue: "NULL_VALUE"
        })) return !1;
        const e = t.data.field(this.field);
        return null !== e && !Le(this.value.arrayValue, e);
    }
}

/** A Filter that implements the array-contains-any operator. */ class Dn extends dn {
    constructor(t, e) {
        super(t, "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ , e);
    }
    matches(t) {
        const e = t.data.field(this.field);
        return !(!je(e) || !e.arrayValue.values) && e.arrayValue.values.some((t => Le(this.value.arrayValue, t)));
    }
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Visible for testing
class Cn {
    constructor(t, e = null, n = [], s = [], i = null, r = null, o = null) {
        this.path = t, this.collectionGroup = e, this.orderBy = n, this.filters = s, this.limit = i, 
        this.startAt = r, this.endAt = o, this.ft = null;
    }
}

/**
 * Initializes a Target with a path and optional additional query constraints.
 * Path must currently be empty if this is a collection group query.
 *
 * NOTE: you should always construct `Target` from `Query.toTarget` instead of
 * using this factory method, because `Query` provides an implicit `orderBy`
 * property.
 */ function xn(t, e = null, n = [], s = [], i = null, r = null, o = null) {
    return new Cn(t, e, n, s, i, r, o);
}

function Nn(t) {
    const e = F(t);
    if (null === e.ft) {
        let t = e.path.canonicalString();
        null !== e.collectionGroup && (t += "|cg:" + e.collectionGroup), t += "|f:", t += e.filters.map((t => pn(t))).join(","), 
        t += "|ob:", t += e.orderBy.map((t => function(t) {
            // TODO(b/29183165): Make this collision robust.
            return t.field.canonicalString() + t.dir;
        }(t))).join(","), $t(e.limit) || (t += "|l:", t += e.limit), e.startAt && (t += "|lb:", 
        t += e.startAt.inclusive ? "b:" : "a:", t += e.startAt.position.map((t => Ke(t))).join(",")), 
        e.endAt && (t += "|ub:", t += e.endAt.inclusive ? "a:" : "b:", t += e.endAt.position.map((t => Ke(t))).join(",")), 
        e.ft = t;
    }
    return e.ft;
}

function kn(t, e) {
    if (t.limit !== e.limit) return !1;
    if (t.orderBy.length !== e.orderBy.length) return !1;
    for (let n = 0; n < t.orderBy.length; n++) if (!ln(t.orderBy[n], e.orderBy[n])) return !1;
    if (t.filters.length !== e.filters.length) return !1;
    for (let n = 0; n < t.filters.length; n++) if (!In(t.filters[n], e.filters[n])) return !1;
    return t.collectionGroup === e.collectionGroup && (!!t.path.isEqual(e.path) && (!!an(t.startAt, e.startAt) && an(t.endAt, e.endAt)));
}

function On(t) {
    return ct.isDocumentKey(t.path) && null === t.collectionGroup && 0 === t.filters.length;
}

/** Returns the field filters that target the given field path. */ function $n(t, e) {
    return t.filters.filter((t => t instanceof dn && t.field.isEqual(e)));
}

/**
 * Returns the values that are used in ARRAY_CONTAINS or ARRAY_CONTAINS_ANY
 * filters. Returns `null` if there are no such filters.
 */
/**
 * Returns the value to use as the lower bound for ascending index segment at
 * the provided `fieldPath` (or the upper bound for an descending segment).
 */
function Mn(t, e, n) {
    let s = Me, i = !0;
    // Process all filters to find a value for the current field segment
    for (const n of $n(t, e)) {
        let t = Me, e = !0;
        switch (n.op) {
          case "<" /* Operator.LESS_THAN */ :
          case "<=" /* Operator.LESS_THAN_OR_EQUAL */ :
            t = Xe(n.value);
            break;

          case "==" /* Operator.EQUAL */ :
          case "in" /* Operator.IN */ :
          case ">=" /* Operator.GREATER_THAN_OR_EQUAL */ :
            t = n.value;
            break;

          case ">" /* Operator.GREATER_THAN */ :
            t = n.value, e = !1;
            break;

          case "!=" /* Operator.NOT_EQUAL */ :
          case "not-in" /* Operator.NOT_IN */ :
            t = Me;
 // Remaining filters cannot be used as lower bounds.
                }
        en({
            value: s,
            inclusive: i
        }, {
            value: t,
            inclusive: e
        }) < 0 && (s = t, i = e);
    }
    // If there is an additional bound, compare the values against the existing
    // range to see if we can narrow the scope.
        if (null !== n) for (let r = 0; r < t.orderBy.length; ++r) {
        if (t.orderBy[r].field.isEqual(e)) {
            const t = n.position[r];
            en({
                value: s,
                inclusive: i
            }, {
                value: t,
                inclusive: n.inclusive
            }) < 0 && (s = t, i = n.inclusive);
            break;
        }
    }
    return {
        value: s,
        inclusive: i
    };
}

/**
 * Returns the value to use as the upper bound for ascending index segment at
 * the provided `fieldPath` (or the lower bound for a descending segment).
 */ function Fn(t, e, n) {
    let s = $e, i = !0;
    // Process all filters to find a value for the current field segment
    for (const n of $n(t, e)) {
        let t = $e, e = !0;
        switch (n.op) {
          case ">=" /* Operator.GREATER_THAN_OR_EQUAL */ :
          case ">" /* Operator.GREATER_THAN */ :
            t = tn(n.value), e = !1;
            break;

          case "==" /* Operator.EQUAL */ :
          case "in" /* Operator.IN */ :
          case "<=" /* Operator.LESS_THAN_OR_EQUAL */ :
            t = n.value;
            break;

          case "<" /* Operator.LESS_THAN */ :
            t = n.value, e = !1;
            break;

          case "!=" /* Operator.NOT_EQUAL */ :
          case "not-in" /* Operator.NOT_IN */ :
            t = $e;
 // Remaining filters cannot be used as upper bounds.
                }
        nn({
            value: s,
            inclusive: i
        }, {
            value: t,
            inclusive: e
        }) > 0 && (s = t, i = e);
    }
    // If there is an additional bound, compare the values against the existing
    // range to see if we can narrow the scope.
        if (null !== n) for (let r = 0; r < t.orderBy.length; ++r) {
        if (t.orderBy[r].field.isEqual(e)) {
            const t = n.position[r];
            nn({
                value: s,
                inclusive: i
            }, {
                value: t,
                inclusive: n.inclusive
            }) > 0 && (s = t, i = n.inclusive);
            break;
        }
    }
    return {
        value: s,
        inclusive: i
    };
}

/** Returns the number of segments of a perfect index for this target. */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Query encapsulates all the query attributes we support in the SDK. It can
 * be run against the LocalStore, as well as be converted to a `Target` to
 * query the RemoteStore results.
 *
 * Visible for testing.
 */
class Bn {
    /**
     * Initializes a Query with a path and optional additional query constraints.
     * Path must currently be empty if this is a collection group query.
     */
    constructor(t, e = null, n = [], s = [], i = null, r = "F" /* LimitType.First */ , o = null, u = null) {
        this.path = t, this.collectionGroup = e, this.explicitOrderBy = n, this.filters = s, 
        this.limit = i, this.limitType = r, this.startAt = o, this.endAt = u, this.dt = null, 
        // The corresponding `Target` of this `Query` instance.
        this.wt = null, this.startAt, this.endAt;
    }
}

/** Creates a new Query instance with the options provided. */ function Ln(t, e, n, s, i, r, o, u) {
    return new Bn(t, e, n, s, i, r, o, u);
}

/** Creates a new Query for a query that matches all documents at `path` */ function qn(t) {
    return new Bn(t);
}

/**
 * Helper to convert a collection group query into a collection query at a
 * specific path. This is used when executing collection group queries, since
 * we have to split the query into a set of collection queries at multiple
 * paths.
 */
/**
 * Returns true if this query does not specify any query constraints that
 * could remove results.
 */
function Un(t) {
    return 0 === t.filters.length && null === t.limit && null == t.startAt && null == t.endAt && (0 === t.explicitOrderBy.length || 1 === t.explicitOrderBy.length && t.explicitOrderBy[0].field.isKeyField());
}

function Kn(t) {
    return t.explicitOrderBy.length > 0 ? t.explicitOrderBy[0].field : null;
}

function Gn(t) {
    for (const e of t.filters) {
        const t = e.getFirstInequalityField();
        if (null !== t) return t;
    }
    return null;
}

/**
 * Creates a new Query for a collection group query that matches all documents
 * within the provided collection group.
 */
/**
 * Returns whether the query matches a collection group rather than a specific
 * collection.
 */
function Qn(t) {
    return null !== t.collectionGroup;
}

/**
 * Returns the implicit order by constraint that is used to execute the Query,
 * which can be different from the order by constraints the user provided (e.g.
 * the SDK and backend always orders by `__name__`).
 */ function zn(t) {
    const e = F(t);
    if (null === e.dt) {
        e.dt = [];
        const t = Gn(e), n = Kn(e);
        if (null !== t && null === n) 
        // In order to implicitly add key ordering, we must also add the
        // inequality filter field for it to be a valid query.
        // Note that the default inequality field and key ordering is ascending.
        t.isKeyField() || e.dt.push(new hn(t)), e.dt.push(new hn(ut.keyField(), "asc" /* Direction.ASCENDING */)); else {
            let t = !1;
            for (const n of e.explicitOrderBy) e.dt.push(n), n.field.isKeyField() && (t = !0);
            if (!t) {
                // The order of the implicit key ordering always matches the last
                // explicit order by
                const t = e.explicitOrderBy.length > 0 ? e.explicitOrderBy[e.explicitOrderBy.length - 1].dir : "asc" /* Direction.ASCENDING */;
                e.dt.push(new hn(ut.keyField(), t));
            }
        }
    }
    return e.dt;
}

/**
 * Converts this `Query` instance to it's corresponding `Target` representation.
 */ function jn(t) {
    const e = F(t);
    if (!e.wt) if ("F" /* LimitType.First */ === e.limitType) e.wt = xn(e.path, e.collectionGroup, zn(e), e.filters, e.limit, e.startAt, e.endAt); else {
        // Flip the orderBy directions since we want the last results
        const t = [];
        for (const n of zn(e)) {
            const e = "desc" /* Direction.DESCENDING */ === n.dir ? "asc" /* Direction.ASCENDING */ : "desc" /* Direction.DESCENDING */;
            t.push(new hn(n.field, e));
        }
        // We need to swap the cursors to match the now-flipped query ordering.
                const n = e.endAt ? new un(e.endAt.position, e.endAt.inclusive) : null, s = e.startAt ? new un(e.startAt.position, e.startAt.inclusive) : null;
        // Now return as a LimitType.First query.
        e.wt = xn(e.path, e.collectionGroup, t, e.filters, e.limit, n, s);
    }
    return e.wt;
}

function Wn(t, e) {
    e.getFirstInequalityField(), Gn(t);
    const n = t.filters.concat([ e ]);
    return new Bn(t.path, t.collectionGroup, t.explicitOrderBy.slice(), n, t.limit, t.limitType, t.startAt, t.endAt);
}

function Hn(t, e, n) {
    return new Bn(t.path, t.collectionGroup, t.explicitOrderBy.slice(), t.filters.slice(), e, n, t.startAt, t.endAt);
}

function Jn(t, e) {
    return kn(jn(t), jn(e)) && t.limitType === e.limitType;
}

// TODO(b/29183165): This is used to get a unique string from a query to, for
// example, use as a dictionary key, but the implementation is subject to
// collisions. Make it collision-free.
function Yn(t) {
    return `${Nn(jn(t))}|lt:${t.limitType}`;
}

function Zn(t) {
    return `Query(target=${function(t) {
        let e = t.path.canonicalString();
        return null !== t.collectionGroup && (e += " collectionGroup=" + t.collectionGroup), 
        t.filters.length > 0 && (e += `, filters: [${t.filters.map((t => En(t))).join(", ")}]`), 
        $t(t.limit) || (e += ", limit: " + t.limit), t.orderBy.length > 0 && (e += `, orderBy: [${t.orderBy.map((t => function(t) {
            return `${t.field.canonicalString()} (${t.dir})`;
        }(t))).join(", ")}]`), t.startAt && (e += ", startAt: ", e += t.startAt.inclusive ? "b:" : "a:", 
        e += t.startAt.position.map((t => Ke(t))).join(",")), t.endAt && (e += ", endAt: ", 
        e += t.endAt.inclusive ? "a:" : "b:", e += t.endAt.position.map((t => Ke(t))).join(",")), 
        `Target(${e})`;
    }(jn(t))}; limitType=${t.limitType})`;
}

/** Returns whether `doc` matches the constraints of `query`. */ function Xn(t, e) {
    return e.isFoundDocument() && function(t, e) {
        const n = e.key.path;
        return null !== t.collectionGroup ? e.key.hasCollectionId(t.collectionGroup) && t.path.isPrefixOf(n) : ct.isDocumentKey(t.path) ? t.path.isEqual(n) : t.path.isImmediateParentOf(n);
    }
    /**
 * A document must have a value for every ordering clause in order to show up
 * in the results.
 */ (t, e) && function(t, e) {
        // We must use `queryOrderBy()` to get the list of all orderBys (both implicit and explicit).
        // Note that for OR queries, orderBy applies to all disjunction terms and implicit orderBys must
        // be taken into account. For example, the query "a > 1 || b==1" has an implicit "orderBy a" due
        // to the inequality, and is evaluated as "a > 1 orderBy a || b==1 orderBy a".
        // A document with content of {b:1} matches the filters, but does not match the orderBy because
        // it's missing the field 'a'.
        for (const n of zn(t)) 
        // order by key always matches
        if (!n.field.isKeyField() && null === e.data.field(n.field)) return !1;
        return !0;
    }(t, e) && function(t, e) {
        for (const n of t.filters) if (!n.matches(e)) return !1;
        return !0;
    }
    /** Makes sure a document is within the bounds, if provided. */ (t, e) && function(t, e) {
        if (t.startAt && !
        /**
 * Returns true if a document sorts before a bound using the provided sort
 * order.
 */
        function(t, e, n) {
            const s = cn(t, e, n);
            return t.inclusive ? s <= 0 : s < 0;
        }(t.startAt, zn(t), e)) return !1;
        if (t.endAt && !function(t, e, n) {
            const s = cn(t, e, n);
            return t.inclusive ? s >= 0 : s > 0;
        }(t.endAt, zn(t), e)) return !1;
        return !0;
    }
    /**
 * Returns the collection group that this query targets.
 *
 * PORTING NOTE: This is only used in the Web SDK to facilitate multi-tab
 * synchronization for query results.
 */ (t, e);
}

function ts(t) {
    return t.collectionGroup || (t.path.length % 2 == 1 ? t.path.lastSegment() : t.path.get(t.path.length - 2));
}

/**
 * Returns a new comparator function that can be used to compare two documents
 * based on the Query's ordering constraint.
 */ function es(t) {
    return (e, n) => {
        let s = !1;
        for (const i of zn(t)) {
            const t = ns(i, e, n);
            if (0 !== t) return t;
            s = s || i.field.isKeyField();
        }
        return 0;
    };
}

function ns(t, e, n) {
    const s = t.field.isKeyField() ? ct.comparator(e.key, n.key) : function(t, e, n) {
        const s = e.data.field(t), i = n.data.field(t);
        return null !== s && null !== i ? qe(s, i) : O();
    }(t.field, e, n);
    switch (t.dir) {
      case "asc" /* Direction.ASCENDING */ :
        return s;

      case "desc" /* Direction.DESCENDING */ :
        return -1 * s;

      default:
        return O();
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A map implementation that uses objects as keys. Objects must have an
 * associated equals function and must be immutable. Entries in the map are
 * stored together with the key being produced from the mapKeyFn. This map
 * automatically handles collisions of keys.
 */ class ss {
    constructor(t, e) {
        this.mapKeyFn = t, this.equalsFn = e, 
        /**
         * The inner map for a key/value pair. Due to the possibility of collisions we
         * keep a list of entries that we do a linear search through to find an actual
         * match. Note that collisions should be rare, so we still expect near
         * constant time lookups in practice.
         */
        this.inner = {}, 
        /** The number of entries stored in the map */
        this.innerSize = 0;
    }
    /** Get a value for this key, or undefined if it does not exist. */    get(t) {
        const e = this.mapKeyFn(t), n = this.inner[e];
        if (void 0 !== n) for (const [e, s] of n) if (this.equalsFn(e, t)) return s;
    }
    has(t) {
        return void 0 !== this.get(t);
    }
    /** Put this key and value in the map. */    set(t, e) {
        const n = this.mapKeyFn(t), s = this.inner[n];
        if (void 0 === s) return this.inner[n] = [ [ t, e ] ], void this.innerSize++;
        for (let n = 0; n < s.length; n++) if (this.equalsFn(s[n][0], t)) 
        // This is updating an existing entry and does not increase `innerSize`.
        return void (s[n] = [ t, e ]);
        s.push([ t, e ]), this.innerSize++;
    }
    /**
     * Remove this key from the map. Returns a boolean if anything was deleted.
     */    delete(t) {
        const e = this.mapKeyFn(t), n = this.inner[e];
        if (void 0 === n) return !1;
        for (let s = 0; s < n.length; s++) if (this.equalsFn(n[s][0], t)) return 1 === n.length ? delete this.inner[e] : n.splice(s, 1), 
        this.innerSize--, !0;
        return !1;
    }
    forEach(t) {
        _e(this.inner, ((e, n) => {
            for (const [e, s] of n) t(e, s);
        }));
    }
    isEmpty() {
        return me(this.inner);
    }
    size() {
        return this.innerSize;
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const is = new ge(ct.comparator);

function rs() {
    return is;
}

const os = new ge(ct.comparator);

function us(...t) {
    let e = os;
    for (const n of t) e = e.insert(n.key, n);
    return e;
}

function cs(t) {
    let e = os;
    return t.forEach(((t, n) => e = e.insert(t, n.overlayedDocument))), e;
}

function as() {
    return ls();
}

function hs() {
    return ls();
}

function ls() {
    return new ss((t => t.toString()), ((t, e) => t.isEqual(e)));
}

const fs = new ge(ct.comparator);

const ds = new Ie(ct.comparator);

function ws(...t) {
    let e = ds;
    for (const n of t) e = e.add(n);
    return e;
}

const _s = new Ie(X);

function ms() {
    return _s;
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Returns an DoubleValue for `value` that is encoded based the serializer's
 * `useProto3Json` setting.
 */ function gs(t, e) {
    if (t.useProto3Json) {
        if (isNaN(e)) return {
            doubleValue: "NaN"
        };
        if (e === 1 / 0) return {
            doubleValue: "Infinity"
        };
        if (e === -1 / 0) return {
            doubleValue: "-Infinity"
        };
    }
    return {
        doubleValue: Mt(e) ? "-0" : e
    };
}

/**
 * Returns an IntegerValue for `value`.
 */ function ys(t) {
    return {
        integerValue: "" + t
    };
}

/**
 * Returns a value for a number that's appropriate to put into a proto.
 * The return value is an IntegerValue if it can safely represent the value,
 * otherwise a DoubleValue is returned.
 */ function ps(t, e) {
    return Ft(e) ? ys(e) : gs(t, e);
}

/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** Used to represent a field transform on a mutation. */ class Is {
    constructor() {
        // Make sure that the structural type of `TransformOperation` is unique.
        // See https://github.com/microsoft/TypeScript/issues/5451
        this._ = void 0;
    }
}

/**
 * Computes the local transform result against the provided `previousValue`,
 * optionally using the provided localWriteTime.
 */ function Ts(t, e, n) {
    return t instanceof Rs ? function(t, e) {
        const n = {
            fields: {
                __type__: {
                    stringValue: "server_timestamp"
                },
                __local_write_time__: {
                    timestampValue: {
                        seconds: t.seconds,
                        nanos: t.nanoseconds
                    }
                }
            }
        };
        return e && (n.fields.__previous_value__ = e), {
            mapValue: n
        };
    }(n, e) : t instanceof vs ? bs(t, e) : t instanceof Ps ? Vs(t, e) : function(t, e) {
        // PORTING NOTE: Since JavaScript's integer arithmetic is limited to 53 bit
        // precision and resolves overflows by reducing precision, we do not
        // manually cap overflows at 2^63.
        const n = As(t, e), s = Ds(n) + Ds(t._t);
        return ze(n) && ze(t._t) ? ys(s) : gs(t.serializer, s);
    }(t, e);
}

/**
 * Computes a final transform result after the transform has been acknowledged
 * by the server, potentially using the server-provided transformResult.
 */ function Es(t, e, n) {
    // The server just sends null as the transform result for array operations,
    // so we have to calculate a result the same as we do for local
    // applications.
    return t instanceof vs ? bs(t, e) : t instanceof Ps ? Vs(t, e) : n;
}

/**
 * If this transform operation is not idempotent, returns the base value to
 * persist for this transform. If a base value is returned, the transform
 * operation is always applied to this base value, even if document has
 * already been updated.
 *
 * Base values provide consistent behavior for non-idempotent transforms and
 * allow us to return the same latency-compensated value even if the backend
 * has already applied the transform operation. The base value is null for
 * idempotent transforms, as they can be re-played even if the backend has
 * already applied them.
 *
 * @returns a base value to store along with the mutation, or null for
 * idempotent transforms.
 */ function As(t, e) {
    return t instanceof Ss ? ze(n = e) || function(t) {
        return !!t && "doubleValue" in t;
    }
    /** Returns true if `value` is either an IntegerValue or a DoubleValue. */ (n) ? e : {
        integerValue: 0
    } : null;
    var n;
}

/** Transforms a value into a server-generated timestamp. */
class Rs extends Is {}

/** Transforms an array value via a union operation. */ class vs extends Is {
    constructor(t) {
        super(), this.elements = t;
    }
}

function bs(t, e) {
    const n = Cs(e);
    for (const e of t.elements) n.some((t => Be(t, e))) || n.push(e);
    return {
        arrayValue: {
            values: n
        }
    };
}

/** Transforms an array value via a remove operation. */ class Ps extends Is {
    constructor(t) {
        super(), this.elements = t;
    }
}

function Vs(t, e) {
    let n = Cs(e);
    for (const e of t.elements) n = n.filter((t => !Be(t, e)));
    return {
        arrayValue: {
            values: n
        }
    };
}

/**
 * Implements the backend semantics for locally computed NUMERIC_ADD (increment)
 * transforms. Converts all field values to integers or doubles, but unlike the
 * backend does not cap integer values at 2^63. Instead, JavaScript number
 * arithmetic is used and precision loss can occur for values greater than 2^53.
 */ class Ss extends Is {
    constructor(t, e) {
        super(), this.serializer = t, this._t = e;
    }
}

function Ds(t) {
    return Se(t.integerValue || t.doubleValue);
}

function Cs(t) {
    return je(t) && t.arrayValue.values ? t.arrayValue.values.slice() : [];
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** A field path and the TransformOperation to perform upon it. */ class xs {
    constructor(t, e) {
        this.field = t, this.transform = e;
    }
}

function Ns(t, e) {
    return t.field.isEqual(e.field) && function(t, e) {
        return t instanceof vs && e instanceof vs || t instanceof Ps && e instanceof Ps ? tt(t.elements, e.elements, Be) : t instanceof Ss && e instanceof Ss ? Be(t._t, e._t) : t instanceof Rs && e instanceof Rs;
    }(t.transform, e.transform);
}

/** The result of successfully applying a mutation to the backend. */
class ks {
    constructor(
    /**
     * The version at which the mutation was committed:
     *
     * - For most operations, this is the updateTime in the WriteResult.
     * - For deletes, the commitTime of the WriteResponse (because deletes are
     *   not stored and have no updateTime).
     *
     * Note that these versions can be different: No-op writes will not change
     * the updateTime even though the commitTime advances.
     */
    t, 
    /**
     * The resulting fields returned from the backend after a mutation
     * containing field transforms has been committed. Contains one FieldValue
     * for each FieldTransform that was in the mutation.
     *
     * Will be empty if the mutation did not contain any field transforms.
     */
    e) {
        this.version = t, this.transformResults = e;
    }
}

/**
 * Encodes a precondition for a mutation. This follows the model that the
 * backend accepts with the special case of an explicit "empty" precondition
 * (meaning no precondition).
 */ class Os {
    constructor(t, e) {
        this.updateTime = t, this.exists = e;
    }
    /** Creates a new empty Precondition. */    static none() {
        return new Os;
    }
    /** Creates a new Precondition with an exists flag. */    static exists(t) {
        return new Os(void 0, t);
    }
    /** Creates a new Precondition based on a version a document exists at. */    static updateTime(t) {
        return new Os(t);
    }
    /** Returns whether this Precondition is empty. */    get isNone() {
        return void 0 === this.updateTime && void 0 === this.exists;
    }
    isEqual(t) {
        return this.exists === t.exists && (this.updateTime ? !!t.updateTime && this.updateTime.isEqual(t.updateTime) : !t.updateTime);
    }
}

/** Returns true if the preconditions is valid for the given document. */ function $s(t, e) {
    return void 0 !== t.updateTime ? e.isFoundDocument() && e.version.isEqual(t.updateTime) : void 0 === t.exists || t.exists === e.isFoundDocument();
}

/**
 * A mutation describes a self-contained change to a document. Mutations can
 * create, replace, delete, and update subsets of documents.
 *
 * Mutations not only act on the value of the document but also its version.
 *
 * For local mutations (mutations that haven't been committed yet), we preserve
 * the existing version for Set and Patch mutations. For Delete mutations, we
 * reset the version to 0.
 *
 * Here's the expected transition table.
 *
 * MUTATION           APPLIED TO            RESULTS IN
 *
 * SetMutation        Document(v3)          Document(v3)
 * SetMutation        NoDocument(v3)        Document(v0)
 * SetMutation        InvalidDocument(v0)   Document(v0)
 * PatchMutation      Document(v3)          Document(v3)
 * PatchMutation      NoDocument(v3)        NoDocument(v3)
 * PatchMutation      InvalidDocument(v0)   UnknownDocument(v3)
 * DeleteMutation     Document(v3)          NoDocument(v0)
 * DeleteMutation     NoDocument(v3)        NoDocument(v0)
 * DeleteMutation     InvalidDocument(v0)   NoDocument(v0)
 *
 * For acknowledged mutations, we use the updateTime of the WriteResponse as
 * the resulting version for Set and Patch mutations. As deletes have no
 * explicit update time, we use the commitTime of the WriteResponse for
 * Delete mutations.
 *
 * If a mutation is acknowledged by the backend but fails the precondition check
 * locally, we transition to an `UnknownDocument` and rely on Watch to send us
 * the updated version.
 *
 * Field transforms are used only with Patch and Set Mutations. We use the
 * `updateTransforms` message to store transforms, rather than the `transforms`s
 * messages.
 *
 * ## Subclassing Notes
 *
 * Every type of mutation needs to implement its own applyToRemoteDocument() and
 * applyToLocalView() to implement the actual behavior of applying the mutation
 * to some source document (see `setMutationApplyToRemoteDocument()` for an
 * example).
 */ class Ms {}

/**
 * A utility method to calculate a `Mutation` representing the overlay from the
 * final state of the document, and a `FieldMask` representing the fields that
 * are mutated by the local mutations.
 */ function Fs(t, e) {
    if (!t.hasLocalMutations || e && 0 === e.fields.length) return null;
    // mask is null when sets or deletes are applied to the current document.
        if (null === e) return t.isNoDocument() ? new Ws(t.key, Os.none()) : new Ks(t.key, t.data, Os.none());
    {
        const n = t.data, s = sn.empty();
        let i = new Ie(ut.comparator);
        for (let t of e.fields) if (!i.has(t)) {
            let e = n.field(t);
            // If we are deleting a nested field, we take the immediate parent as
            // the mask used to construct the resulting mutation.
            // Justification: Nested fields can create parent fields implicitly. If
            // only a leaf entry is deleted in later mutations, the parent field
            // should still remain, but we may have lost this information.
            // Consider mutation (foo.bar 1), then mutation (foo.bar delete()).
            // This leaves the final result (foo, {}). Despite the fact that `doc`
            // has the correct result, `foo` is not in `mask`, and the resulting
            // mutation would miss `foo`.
                        null === e && t.length > 1 && (t = t.popLast(), e = n.field(t)), null === e ? s.delete(t) : s.set(t, e), 
            i = i.add(t);
        }
        return new Gs(t.key, s, new Ae(i.toArray()), Os.none());
    }
}

/**
 * Applies this mutation to the given document for the purposes of computing a
 * new remote document. If the input document doesn't match the expected state
 * (e.g. it is invalid or outdated), the document type may transition to
 * unknown.
 *
 * @param mutation - The mutation to apply.
 * @param document - The document to mutate. The input document can be an
 *     invalid document if the client has no knowledge of the pre-mutation state
 *     of the document.
 * @param mutationResult - The result of applying the mutation from the backend.
 */ function Bs(t, e, n) {
    t instanceof Ks ? function(t, e, n) {
        // Unlike setMutationApplyToLocalView, if we're applying a mutation to a
        // remote document the server has accepted the mutation so the precondition
        // must have held.
        const s = t.value.clone(), i = zs(t.fieldTransforms, e, n.transformResults);
        s.setAll(i), e.convertToFoundDocument(n.version, s).setHasCommittedMutations();
    }(t, e, n) : t instanceof Gs ? function(t, e, n) {
        if (!$s(t.precondition, e)) 
        // Since the mutation was not rejected, we know that the precondition
        // matched on the backend. We therefore must not have the expected version
        // of the document in our cache and convert to an UnknownDocument with a
        // known updateTime.
        return void e.convertToUnknownDocument(n.version);
        const s = zs(t.fieldTransforms, e, n.transformResults), i = e.data;
        i.setAll(Qs(t)), i.setAll(s), e.convertToFoundDocument(n.version, i).setHasCommittedMutations();
    }(t, e, n) : function(t, e, n) {
        // Unlike applyToLocalView, if we're applying a mutation to a remote
        // document the server has accepted the mutation so the precondition must
        // have held.
        e.convertToNoDocument(n.version).setHasCommittedMutations();
    }(0, e, n);
}

/**
 * Applies this mutation to the given document for the purposes of computing
 * the new local view of a document. If the input document doesn't match the
 * expected state, the document is not modified.
 *
 * @param mutation - The mutation to apply.
 * @param document - The document to mutate. The input document can be an
 *     invalid document if the client has no knowledge of the pre-mutation state
 *     of the document.
 * @param previousMask - The fields that have been updated before applying this mutation.
 * @param localWriteTime - A timestamp indicating the local write time of the
 *     batch this mutation is a part of.
 * @returns A `FieldMask` representing the fields that are changed by applying this mutation.
 */ function Ls(t, e, n, s) {
    return t instanceof Ks ? function(t, e, n, s) {
        if (!$s(t.precondition, e)) 
        // The mutation failed to apply (e.g. a document ID created with add()
        // caused a name collision).
        return n;
        const i = t.value.clone(), r = js(t.fieldTransforms, s, e);
        return i.setAll(r), e.convertToFoundDocument(e.version, i).setHasLocalMutations(), 
        null;
 // SetMutation overwrites all fields.
        }
    /**
 * A mutation that modifies fields of the document at the given key with the
 * given values. The values are applied through a field mask:
 *
 *  * When a field is in both the mask and the values, the corresponding field
 *    is updated.
 *  * When a field is in neither the mask nor the values, the corresponding
 *    field is unmodified.
 *  * When a field is in the mask but not in the values, the corresponding field
 *    is deleted.
 *  * When a field is not in the mask but is in the values, the values map is
 *    ignored.
 */ (t, e, n, s) : t instanceof Gs ? function(t, e, n, s) {
        if (!$s(t.precondition, e)) return n;
        const i = js(t.fieldTransforms, s, e), r = e.data;
        if (r.setAll(Qs(t)), r.setAll(i), e.convertToFoundDocument(e.version, r).setHasLocalMutations(), 
        null === n) return null;
        return n.unionWith(t.fieldMask.fields).unionWith(t.fieldTransforms.map((t => t.field)));
    }
    /**
 * Returns a FieldPath/Value map with the content of the PatchMutation.
 */ (t, e, n, s) : function(t, e, n) {
        if ($s(t.precondition, e)) return e.convertToNoDocument(e.version).setHasLocalMutations(), 
        null;
        return n;
    }
    /**
 * A mutation that verifies the existence of the document at the given key with
 * the provided precondition.
 *
 * The `verify` operation is only used in Transactions, and this class serves
 * primarily to facilitate serialization into protos.
 */ (t, e, n);
}

/**
 * If this mutation is not idempotent, returns the base value to persist with
 * this mutation. If a base value is returned, the mutation is always applied
 * to this base value, even if document has already been updated.
 *
 * The base value is a sparse object that consists of only the document
 * fields for which this mutation contains a non-idempotent transformation
 * (e.g. a numeric increment). The provided value guarantees consistent
 * behavior for non-idempotent transforms and allow us to return the same
 * latency-compensated value even if the backend has already applied the
 * mutation. The base value is null for idempotent mutations, as they can be
 * re-played even if the backend has already applied them.
 *
 * @returns a base value to store along with the mutation, or null for
 * idempotent mutations.
 */ function qs(t, e) {
    let n = null;
    for (const s of t.fieldTransforms) {
        const t = e.data.field(s.field), i = As(s.transform, t || null);
        null != i && (null === n && (n = sn.empty()), n.set(s.field, i));
    }
    return n || null;
}

function Us(t, e) {
    return t.type === e.type && (!!t.key.isEqual(e.key) && (!!t.precondition.isEqual(e.precondition) && (!!function(t, e) {
        return void 0 === t && void 0 === e || !(!t || !e) && tt(t, e, ((t, e) => Ns(t, e)));
    }(t.fieldTransforms, e.fieldTransforms) && (0 /* MutationType.Set */ === t.type ? t.value.isEqual(e.value) : 1 /* MutationType.Patch */ !== t.type || t.data.isEqual(e.data) && t.fieldMask.isEqual(e.fieldMask)))));
}

/**
 * A mutation that creates or replaces the document at the given key with the
 * object value contents.
 */ class Ks extends Ms {
    constructor(t, e, n, s = []) {
        super(), this.key = t, this.value = e, this.precondition = n, this.fieldTransforms = s, 
        this.type = 0 /* MutationType.Set */;
    }
    getFieldMask() {
        return null;
    }
}

class Gs extends Ms {
    constructor(t, e, n, s, i = []) {
        super(), this.key = t, this.data = e, this.fieldMask = n, this.precondition = s, 
        this.fieldTransforms = i, this.type = 1 /* MutationType.Patch */;
    }
    getFieldMask() {
        return this.fieldMask;
    }
}

function Qs(t) {
    const e = new Map;
    return t.fieldMask.fields.forEach((n => {
        if (!n.isEmpty()) {
            const s = t.data.field(n);
            e.set(n, s);
        }
    })), e;
}

/**
 * Creates a list of "transform results" (a transform result is a field value
 * representing the result of applying a transform) for use after a mutation
 * containing transforms has been acknowledged by the server.
 *
 * @param fieldTransforms - The field transforms to apply the result to.
 * @param mutableDocument - The current state of the document after applying all
 * previous mutations.
 * @param serverTransformResults - The transform results received by the server.
 * @returns The transform results list.
 */ function zs(t, e, n) {
    const s = new Map;
    $(t.length === n.length);
    for (let i = 0; i < n.length; i++) {
        const r = t[i], o = r.transform, u = e.data.field(r.field);
        s.set(r.field, Es(o, u, n[i]));
    }
    return s;
}

/**
 * Creates a list of "transform results" (a transform result is a field value
 * representing the result of applying a transform) for use when applying a
 * transform locally.
 *
 * @param fieldTransforms - The field transforms to apply the result to.
 * @param localWriteTime - The local time of the mutation (used to
 *     generate ServerTimestampValues).
 * @param mutableDocument - The document to apply transforms on.
 * @returns The transform results list.
 */ function js(t, e, n) {
    const s = new Map;
    for (const i of t) {
        const t = i.transform, r = n.data.field(i.field);
        s.set(i.field, Ts(t, r, e));
    }
    return s;
}

/** A mutation that deletes the document at the given key. */ class Ws extends Ms {
    constructor(t, e) {
        super(), this.key = t, this.precondition = e, this.type = 2 /* MutationType.Delete */ , 
        this.fieldTransforms = [];
    }
    getFieldMask() {
        return null;
    }
}

class Hs extends Ms {
    constructor(t, e) {
        super(), this.key = t, this.precondition = e, this.type = 3 /* MutationType.Verify */ , 
        this.fieldTransforms = [];
    }
    getFieldMask() {
        return null;
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A batch of mutations that will be sent as one unit to the backend.
 */ class Js {
    /**
     * @param batchId - The unique ID of this mutation batch.
     * @param localWriteTime - The original write time of this mutation.
     * @param baseMutations - Mutations that are used to populate the base
     * values when this mutation is applied locally. This can be used to locally
     * overwrite values that are persisted in the remote document cache. Base
     * mutations are never sent to the backend.
     * @param mutations - The user-provided mutations in this mutation batch.
     * User-provided mutations are applied both locally and remotely on the
     * backend.
     */
    constructor(t, e, n, s) {
        this.batchId = t, this.localWriteTime = e, this.baseMutations = n, this.mutations = s;
    }
    /**
     * Applies all the mutations in this MutationBatch to the specified document
     * to compute the state of the remote document
     *
     * @param document - The document to apply mutations to.
     * @param batchResult - The result of applying the MutationBatch to the
     * backend.
     */    applyToRemoteDocument(t, e) {
        const n = e.mutationResults;
        for (let e = 0; e < this.mutations.length; e++) {
            const s = this.mutations[e];
            if (s.key.isEqual(t.key)) {
                Bs(s, t, n[e]);
            }
        }
    }
    /**
     * Computes the local view of a document given all the mutations in this
     * batch.
     *
     * @param document - The document to apply mutations to.
     * @param mutatedFields - Fields that have been updated before applying this mutation batch.
     * @returns A `FieldMask` representing all the fields that are mutated.
     */    applyToLocalView(t, e) {
        // First, apply the base state. This allows us to apply non-idempotent
        // transform against a consistent set of values.
        for (const n of this.baseMutations) n.key.isEqual(t.key) && (e = Ls(n, t, e, this.localWriteTime));
        // Second, apply all user-provided mutations.
                for (const n of this.mutations) n.key.isEqual(t.key) && (e = Ls(n, t, e, this.localWriteTime));
        return e;
    }
    /**
     * Computes the local view for all provided documents given the mutations in
     * this batch. Returns a `DocumentKey` to `Mutation` map which can be used to
     * replace all the mutation applications.
     */    applyToLocalDocumentSet(t, e) {
        // TODO(mrschmidt): This implementation is O(n^2). If we apply the mutations
        // directly (as done in `applyToLocalView()`), we can reduce the complexity
        // to O(n).
        const n = hs();
        return this.mutations.forEach((s => {
            const i = t.get(s.key), r = i.overlayedDocument;
            // TODO(mutabledocuments): This method should take a MutableDocumentMap
            // and we should remove this cast.
                        let o = this.applyToLocalView(r, i.mutatedFields);
            // Set mutatedFields to null if the document is only from local mutations.
            // This creates a Set or Delete mutation, instead of trying to create a
            // patch mutation as the overlay.
                        o = e.has(s.key) ? null : o;
            const u = Fs(r, o);
            null !== u && n.set(s.key, u), r.isValidDocument() || r.convertToNoDocument(st.min());
        })), n;
    }
    keys() {
        return this.mutations.reduce(((t, e) => t.add(e.key)), ws());
    }
    isEqual(t) {
        return this.batchId === t.batchId && tt(this.mutations, t.mutations, ((t, e) => Us(t, e))) && tt(this.baseMutations, t.baseMutations, ((t, e) => Us(t, e)));
    }
}

/** The result of applying a mutation batch to the backend. */ class Ys {
    constructor(t, e, n, 
    /**
     * A pre-computed mapping from each mutated document to the resulting
     * version.
     */
    s) {
        this.batch = t, this.commitVersion = e, this.mutationResults = n, this.docVersions = s;
    }
    /**
     * Creates a new MutationBatchResult for the given batch and results. There
     * must be one result for each mutation in the batch. This static factory
     * caches a document=&gt;version mapping (docVersions).
     */    static from(t, e, n) {
        $(t.mutations.length === n.length);
        let s = fs;
        const i = t.mutations;
        for (let t = 0; t < i.length; t++) s = s.insert(i[t].key, n[t].version);
        return new Ys(t, e, n, s);
    }
}

/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Representation of an overlay computed by Firestore.
 *
 * Holds information about a mutation and the largest batch id in Firestore when
 * the mutation was created.
 */ class Zs {
    constructor(t, e) {
        this.largestBatchId = t, this.mutation = e;
    }
    getKey() {
        return this.mutation.key;
    }
    isEqual(t) {
        return null !== t && this.mutation === t.mutation;
    }
    toString() {
        return `Overlay{\n      largestBatchId: ${this.largestBatchId},\n      mutation: ${this.mutation.toString()}\n    }`;
    }
}

/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Xs = /^[_a-zA-Z][_a-zA-Z0-9]*(?:\.[_a-zA-Z][_a-zA-Z0-9]*)*$/;

/**
 * An alias for aggregation results.
 * @internal
 */ class ti {
    /**
     * @internal
     * @param alias Un-escaped alias representation
     */
    constructor(t) {
        this.alias = t;
    }
    /**
     * Returns true if the string could be used as an alias.
     */    static gt(t) {
        return Xs.test(t);
    }
    /**
     * Return an escaped and quoted string representation of the alias.
     */    canonicalString() {
        let t = this.alias.replace(/\\/g, "\\\\").replace(/`/g, "\\`");
        return ti.gt(t) || (t = "`" + t + "`"), t;
    }
}

/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Concrete implementation of the Aggregate type.
 */ class ei {
    constructor(t, e, n) {
        this.alias = t, this.yt = e, this.fieldPath = n;
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class ni {
    // TODO(b/33078163): just use simplest form of existence filter for now
    constructor(t) {
        this.count = t;
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Error Codes describing the different ways GRPC can fail. These are copied
 * directly from GRPC's sources here:
 *
 * https://github.com/grpc/grpc/blob/bceec94ea4fc5f0085d81235d8e1c06798dc341a/include/grpc%2B%2B/impl/codegen/status_code_enum.h
 *
 * Important! The names of these identifiers matter because the string forms
 * are used for reverse lookups from the webchannel stream. Do NOT change the
 * names of these identifiers or change this into a const enum.
 */ var si, ii;

/**
 * Determines whether an error code represents a permanent error when received
 * in response to a non-write operation.
 *
 * See isPermanentWriteError for classifying write errors.
 */
function ri(t) {
    switch (t) {
      default:
        return O();

      case B.CANCELLED:
      case B.UNKNOWN:
      case B.DEADLINE_EXCEEDED:
      case B.RESOURCE_EXHAUSTED:
      case B.INTERNAL:
      case B.UNAVAILABLE:
 // Unauthenticated means something went wrong with our token and we need
        // to retry with new credentials which will happen automatically.
              case B.UNAUTHENTICATED:
        return !1;

      case B.INVALID_ARGUMENT:
      case B.NOT_FOUND:
      case B.ALREADY_EXISTS:
      case B.PERMISSION_DENIED:
      case B.FAILED_PRECONDITION:
 // Aborted might be retried in some scenarios, but that is dependant on
        // the context and should handled individually by the calling code.
        // See https://cloud.google.com/apis/design/errors.
              case B.ABORTED:
      case B.OUT_OF_RANGE:
      case B.UNIMPLEMENTED:
      case B.DATA_LOSS:
        return !0;
    }
}

/**
 * Determines whether an error code represents a permanent error when received
 * in response to a write operation.
 *
 * Write operations must be handled specially because as of b/119437764, ABORTED
 * errors on the write stream should be retried too (even though ABORTED errors
 * are not generally retryable).
 *
 * Note that during the initial handshake on the write stream an ABORTED error
 * signals that we should discard our stream token (i.e. it is permanent). This
 * means a handshake error should be classified with isPermanentError, above.
 */
/**
 * Maps an error Code from GRPC status code number, like 0, 1, or 14. These
 * are not the same as HTTP status codes.
 *
 * @returns The Code equivalent to the given GRPC status code. Fails if there
 *     is no match.
 */
function oi(t) {
    if (void 0 === t) 
    // This shouldn't normally happen, but in certain error cases (like trying
    // to send invalid proto messages) we may get an error with no GRPC code.
    return x("GRPC error has no .code"), B.UNKNOWN;
    switch (t) {
      case si.OK:
        return B.OK;

      case si.CANCELLED:
        return B.CANCELLED;

      case si.UNKNOWN:
        return B.UNKNOWN;

      case si.DEADLINE_EXCEEDED:
        return B.DEADLINE_EXCEEDED;

      case si.RESOURCE_EXHAUSTED:
        return B.RESOURCE_EXHAUSTED;

      case si.INTERNAL:
        return B.INTERNAL;

      case si.UNAVAILABLE:
        return B.UNAVAILABLE;

      case si.UNAUTHENTICATED:
        return B.UNAUTHENTICATED;

      case si.INVALID_ARGUMENT:
        return B.INVALID_ARGUMENT;

      case si.NOT_FOUND:
        return B.NOT_FOUND;

      case si.ALREADY_EXISTS:
        return B.ALREADY_EXISTS;

      case si.PERMISSION_DENIED:
        return B.PERMISSION_DENIED;

      case si.FAILED_PRECONDITION:
        return B.FAILED_PRECONDITION;

      case si.ABORTED:
        return B.ABORTED;

      case si.OUT_OF_RANGE:
        return B.OUT_OF_RANGE;

      case si.UNIMPLEMENTED:
        return B.UNIMPLEMENTED;

      case si.DATA_LOSS:
        return B.DATA_LOSS;

      default:
        return O();
    }
}

/**
 * Converts an HTTP response's error status to the equivalent error code.
 *
 * @param status - An HTTP error response status ("FAILED_PRECONDITION",
 * "UNKNOWN", etc.)
 * @returns The equivalent Code. Non-matching responses are mapped to
 *     Code.UNKNOWN.
 */ (ii = si || (si = {}))[ii.OK = 0] = "OK", ii[ii.CANCELLED = 1] = "CANCELLED", 
ii[ii.UNKNOWN = 2] = "UNKNOWN", ii[ii.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", 
ii[ii.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", ii[ii.NOT_FOUND = 5] = "NOT_FOUND", 
ii[ii.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", ii[ii.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", 
ii[ii.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", ii[ii.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", 
ii[ii.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", ii[ii.ABORTED = 10] = "ABORTED", 
ii[ii.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", ii[ii.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", 
ii[ii.INTERNAL = 13] = "INTERNAL", ii[ii.UNAVAILABLE = 14] = "UNAVAILABLE", ii[ii.DATA_LOSS = 15] = "DATA_LOSS";

/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Manages "testing hooks", hooks into the internals of the SDK to verify
 * internal state and events during integration tests. Do not use this class
 * except for testing purposes.
 *
 * There are two ways to retrieve the global singleton instance of this class:
 * 1. The `instance` property, which returns null if the global singleton
 *      instance has not been created. Use this property if the caller should
 *      "do nothing" if there are no testing hooks registered, such as when
 *      delivering an event to notify registered callbacks.
 * 2. The `getOrCreateInstance()` method, which creates the global singleton
 *      instance if it has not been created. Use this method if the instance is
 *      needed to, for example, register a callback.
 *
 * @internal
 */
class ui {
    constructor() {
        this.onExistenceFilterMismatchCallbacks = new Map;
    }
    /**
     * Returns the singleton instance of this class, or null if it has not been
     * initialized.
     */    static get instance() {
        return ci;
    }
    /**
     * Returns the singleton instance of this class, creating it if is has never
     * been created before.
     */    static getOrCreateInstance() {
        return null === ci && (ci = new ui), ci;
    }
    /**
     * Registers a callback to be notified when an existence filter mismatch
     * occurs in the Watch listen stream.
     *
     * The relative order in which callbacks are notified is unspecified; do not
     * rely on any particular ordering. If a given callback is registered multiple
     * times then it will be notified multiple times, once per registration.
     *
     * @param callback the callback to invoke upon existence filter mismatch.
     *
     * @return a function that, when called, unregisters the given callback; only
     * the first invocation of the returned function does anything; all subsequent
     * invocations do nothing.
     */    onExistenceFilterMismatch(t) {
        const e = Symbol();
        return this.onExistenceFilterMismatchCallbacks.set(e, t), () => this.onExistenceFilterMismatchCallbacks.delete(e);
    }
    /**
     * Invokes all currently-registered `onExistenceFilterMismatch` callbacks.
     * @param info Information about the existence filter mismatch.
     */    notifyOnExistenceFilterMismatch(t) {
        this.onExistenceFilterMismatchCallbacks.forEach((e => e(t)));
    }
}

/** The global singleton instance of `TestingHooks`. */ let ci = null;

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * An event from the RemoteStore. It is split into targetChanges (changes to the
 * state or the set of documents in our watched targets) and documentUpdates
 * (changes to the actual documents).
 */ class ai {
    constructor(
    /**
     * The snapshot version this event brings us up to, or MIN if not set.
     */
    t, 
    /**
     * A map from target to changes to the target. See TargetChange.
     */
    e, 
    /**
     * A set of targets that is known to be inconsistent. Listens for these
     * targets should be re-established without resume tokens.
     */
    n, 
    /**
     * A set of which documents have changed or been deleted, along with the
     * doc's new values (if not deleted).
     */
    s, 
    /**
     * A set of which document updates are due only to limbo resolution targets.
     */
    i) {
        this.snapshotVersion = t, this.targetChanges = e, this.targetMismatches = n, this.documentUpdates = s, 
        this.resolvedLimboDocuments = i;
    }
    /**
     * HACK: Views require RemoteEvents in order to determine whether the view is
     * CURRENT, but secondary tabs don't receive remote events. So this method is
     * used to create a synthesized RemoteEvent that can be used to apply a
     * CURRENT status change to a View, for queries executed in a different tab.
     */
    // PORTING NOTE: Multi-tab only
    static createSynthesizedRemoteEventForCurrentChange(t, e, n) {
        const s = new Map;
        return s.set(t, hi.createSynthesizedTargetChangeForCurrentChange(t, e, n)), new ai(st.min(), s, ms(), rs(), ws());
    }
}

/**
 * A TargetChange specifies the set of changes for a specific target as part of
 * a RemoteEvent. These changes track which documents are added, modified or
 * removed, as well as the target's resume token and whether the target is
 * marked CURRENT.
 * The actual changes *to* documents are not part of the TargetChange since
 * documents may be part of multiple targets.
 */ class hi {
    constructor(
    /**
     * An opaque, server-assigned token that allows watching a query to be resumed
     * after disconnecting without retransmitting all the data that matches the
     * query. The resume token essentially identifies a point in time from which
     * the server should resume sending results.
     */
    t, 
    /**
     * The "current" (synced) status of this target. Note that "current"
     * has special meaning in the RPC protocol that implies that a target is
     * both up-to-date and consistent with the rest of the watch stream.
     */
    e, 
    /**
     * The set of documents that were newly assigned to this target as part of
     * this remote event.
     */
    n, 
    /**
     * The set of documents that were already assigned to this target but received
     * an update during this remote event.
     */
    s, 
    /**
     * The set of documents that were removed from this target as part of this
     * remote event.
     */
    i) {
        this.resumeToken = t, this.current = e, this.addedDocuments = n, this.modifiedDocuments = s, 
        this.removedDocuments = i;
    }
    /**
     * This method is used to create a synthesized TargetChanges that can be used to
     * apply a CURRENT status change to a View (for queries executed in a different
     * tab) or for new queries (to raise snapshots with correct CURRENT status).
     */    static createSynthesizedTargetChangeForCurrentChange(t, e, n) {
        return new hi(n, e, ws(), ws(), ws());
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Represents a changed document and a list of target ids to which this change
 * applies.
 *
 * If document has been deleted NoDocument will be provided.
 */ class li {
    constructor(
    /** The new document applies to all of these targets. */
    t, 
    /** The new document is removed from all of these targets. */
    e, 
    /** The key of the document for this change. */
    n, 
    /**
     * The new document or NoDocument if it was deleted. Is null if the
     * document went out of view without the server sending a new document.
     */
    s) {
        this.It = t, this.removedTargetIds = e, this.key = n, this.Tt = s;
    }
}

class fi {
    constructor(t, e) {
        this.targetId = t, this.Et = e;
    }
}

class di {
    constructor(
    /** What kind of change occurred to the watch target. */
    t, 
    /** The target IDs that were added/removed/set. */
    e, 
    /**
     * An opaque, server-assigned token that allows watching a target to be
     * resumed after disconnecting without retransmitting all the data that
     * matches the target. The resume token essentially identifies a point in
     * time from which the server should resume sending results.
     */
    n = be.EMPTY_BYTE_STRING
    /** An RPC error indicating why the watch failed. */ , s = null) {
        this.state = t, this.targetIds = e, this.resumeToken = n, this.cause = s;
    }
}

/** Tracks the internal state of a Watch target. */ class wi {
    constructor() {
        /**
         * The number of pending responses (adds or removes) that we are waiting on.
         * We only consider targets active that have no pending responses.
         */
        this.At = 0, 
        /**
         * Keeps track of the document changes since the last raised snapshot.
         *
         * These changes are continuously updated as we receive document updates and
         * always reflect the current set of changes against the last issued snapshot.
         */
        this.Rt = gi(), 
        /** See public getters for explanations of these fields. */
        this.vt = be.EMPTY_BYTE_STRING, this.bt = !1, 
        /**
         * Whether this target state should be included in the next snapshot. We
         * initialize to true so that newly-added targets are included in the next
         * RemoteEvent.
         */
        this.Pt = !0;
    }
    /**
     * Whether this target has been marked 'current'.
     *
     * 'Current' has special meaning in the RPC protocol: It implies that the
     * Watch backend has sent us all changes up to the point at which the target
     * was added and that the target is consistent with the rest of the watch
     * stream.
     */    get current() {
        return this.bt;
    }
    /** The last resume token sent to us for this target. */    get resumeToken() {
        return this.vt;
    }
    /** Whether this target has pending target adds or target removes. */    get Vt() {
        return 0 !== this.At;
    }
    /** Whether we have modified any state that should trigger a snapshot. */    get St() {
        return this.Pt;
    }
    /**
     * Applies the resume token to the TargetChange, but only when it has a new
     * value. Empty resumeTokens are discarded.
     */    Dt(t) {
        t.approximateByteSize() > 0 && (this.Pt = !0, this.vt = t);
    }
    /**
     * Creates a target change from the current set of changes.
     *
     * To reset the document changes after raising this snapshot, call
     * `clearPendingChanges()`.
     */    Ct() {
        let t = ws(), e = ws(), n = ws();
        return this.Rt.forEach(((s, i) => {
            switch (i) {
              case 0 /* ChangeType.Added */ :
                t = t.add(s);
                break;

              case 2 /* ChangeType.Modified */ :
                e = e.add(s);
                break;

              case 1 /* ChangeType.Removed */ :
                n = n.add(s);
                break;

              default:
                O();
            }
        })), new hi(this.vt, this.bt, t, e, n);
    }
    /**
     * Resets the document changes and sets `hasPendingChanges` to false.
     */    xt() {
        this.Pt = !1, this.Rt = gi();
    }
    Nt(t, e) {
        this.Pt = !0, this.Rt = this.Rt.insert(t, e);
    }
    kt(t) {
        this.Pt = !0, this.Rt = this.Rt.remove(t);
    }
    Ot() {
        this.At += 1;
    }
    $t() {
        this.At -= 1;
    }
    Mt() {
        this.Pt = !0, this.bt = !0;
    }
}

/**
 * A helper class to accumulate watch changes into a RemoteEvent.
 */
class _i {
    constructor(t) {
        this.Ft = t, 
        /** The internal state of all tracked targets. */
        this.Bt = new Map, 
        /** Keeps track of the documents to update since the last raised snapshot. */
        this.Lt = rs(), 
        /** A mapping of document keys to their set of target IDs. */
        this.qt = mi(), 
        /**
         * A list of targets with existence filter mismatches. These targets are
         * known to be inconsistent and their listens needs to be re-established by
         * RemoteStore.
         */
        this.Ut = new Ie(X);
    }
    /**
     * Processes and adds the DocumentWatchChange to the current set of changes.
     */    Kt(t) {
        for (const e of t.It) t.Tt && t.Tt.isFoundDocument() ? this.Gt(e, t.Tt) : this.Qt(e, t.key, t.Tt);
        for (const e of t.removedTargetIds) this.Qt(e, t.key, t.Tt);
    }
    /** Processes and adds the WatchTargetChange to the current set of changes. */    zt(t) {
        this.forEachTarget(t, (e => {
            const n = this.jt(e);
            switch (t.state) {
              case 0 /* WatchTargetChangeState.NoChange */ :
                this.Wt(e) && n.Dt(t.resumeToken);
                break;

              case 1 /* WatchTargetChangeState.Added */ :
                // We need to decrement the number of pending acks needed from watch
                // for this targetId.
                n.$t(), n.Vt || 
                // We have a freshly added target, so we need to reset any state
                // that we had previously. This can happen e.g. when remove and add
                // back a target for existence filter mismatches.
                n.xt(), n.Dt(t.resumeToken);
                break;

              case 2 /* WatchTargetChangeState.Removed */ :
                // We need to keep track of removed targets to we can post-filter and
                // remove any target changes.
                // We need to decrement the number of pending acks needed from watch
                // for this targetId.
                n.$t(), n.Vt || this.removeTarget(e);
                break;

              case 3 /* WatchTargetChangeState.Current */ :
                this.Wt(e) && (n.Mt(), n.Dt(t.resumeToken));
                break;

              case 4 /* WatchTargetChangeState.Reset */ :
                this.Wt(e) && (
                // Reset the target and synthesizes removes for all existing
                // documents. The backend will re-add any documents that still
                // match the target before it sends the next global snapshot.
                this.Ht(e), n.Dt(t.resumeToken));
                break;

              default:
                O();
            }
        }));
    }
    /**
     * Iterates over all targetIds that the watch change applies to: either the
     * targetIds explicitly listed in the change or the targetIds of all currently
     * active targets.
     */    forEachTarget(t, e) {
        t.targetIds.length > 0 ? t.targetIds.forEach(e) : this.Bt.forEach(((t, n) => {
            this.Wt(n) && e(n);
        }));
    }
    /**
     * Handles existence filters and synthesizes deletes for filter mismatches.
     * Targets that are invalidated by filter mismatches are added to
     * `pendingTargetResets`.
     */    Jt(t) {
        var e;
        const n = t.targetId, s = t.Et.count, i = this.Yt(n);
        if (i) {
            const r = i.target;
            if (On(r)) if (0 === s) {
                // The existence filter told us the document does not exist. We deduce
                // that this document does not exist and apply a deleted document to
                // our updates. Without applying this deleted document there might be
                // another query that will raise this document as part of a snapshot
                // until it is resolved, essentially exposing inconsistency between
                // queries.
                const t = new ct(r.path);
                this.Qt(n, t, on.newNoDocument(t, st.min()));
            } else $(1 === s); else {
                const i = this.Zt(n);
                i !== s && (
                // Existence filter mismatch: We reset the mapping and raise a new
                // snapshot with `isFromCache:true`.
                this.Ht(n), this.Ut = this.Ut.add(n), null === (e = ui.instance) || void 0 === e || e.notifyOnExistenceFilterMismatch({
                    localCacheCount: i,
                    existenceFilterCount: t.Et.count
                }));
            }
        }
    }
    /**
     * Converts the currently accumulated state into a remote event at the
     * provided snapshot version. Resets the accumulated changes before returning.
     */    Xt(t) {
        const e = new Map;
        this.Bt.forEach(((n, s) => {
            const i = this.Yt(s);
            if (i) {
                if (n.current && On(i.target)) {
                    // Document queries for document that don't exist can produce an empty
                    // result set. To update our local cache, we synthesize a document
                    // delete if we have not previously received the document. This
                    // resolves the limbo state of the document, removing it from
                    // limboDocumentRefs.
                    // TODO(dimond): Ideally we would have an explicit lookup target
                    // instead resulting in an explicit delete message and we could
                    // remove this special logic.
                    const e = new ct(i.target.path);
                    null !== this.Lt.get(e) || this.te(s, e) || this.Qt(s, e, on.newNoDocument(e, t));
                }
                n.St && (e.set(s, n.Ct()), n.xt());
            }
        }));
        let n = ws();
        // We extract the set of limbo-only document updates as the GC logic
        // special-cases documents that do not appear in the target cache.
        
        // TODO(gsoltis): Expand on this comment once GC is available in the JS
        // client.
                this.qt.forEach(((t, e) => {
            let s = !0;
            e.forEachWhile((t => {
                const e = this.Yt(t);
                return !e || 2 /* TargetPurpose.LimboResolution */ === e.purpose || (s = !1, !1);
            })), s && (n = n.add(t));
        })), this.Lt.forEach(((e, n) => n.setReadTime(t)));
        const s = new ai(t, e, this.Ut, this.Lt, n);
        return this.Lt = rs(), this.qt = mi(), this.Ut = new Ie(X), s;
    }
    /**
     * Adds the provided document to the internal list of document updates and
     * its document key to the given target's mapping.
     */
    // Visible for testing.
    Gt(t, e) {
        if (!this.Wt(t)) return;
        const n = this.te(t, e.key) ? 2 /* ChangeType.Modified */ : 0 /* ChangeType.Added */;
        this.jt(t).Nt(e.key, n), this.Lt = this.Lt.insert(e.key, e), this.qt = this.qt.insert(e.key, this.ee(e.key).add(t));
    }
    /**
     * Removes the provided document from the target mapping. If the
     * document no longer matches the target, but the document's state is still
     * known (e.g. we know that the document was deleted or we received the change
     * that caused the filter mismatch), the new document can be provided
     * to update the remote document cache.
     */
    // Visible for testing.
    Qt(t, e, n) {
        if (!this.Wt(t)) return;
        const s = this.jt(t);
        this.te(t, e) ? s.Nt(e, 1 /* ChangeType.Removed */) : 
        // The document may have entered and left the target before we raised a
        // snapshot, so we can just ignore the change.
        s.kt(e), this.qt = this.qt.insert(e, this.ee(e).delete(t)), n && (this.Lt = this.Lt.insert(e, n));
    }
    removeTarget(t) {
        this.Bt.delete(t);
    }
    /**
     * Returns the current count of documents in the target. This includes both
     * the number of documents that the LocalStore considers to be part of the
     * target as well as any accumulated changes.
     */    Zt(t) {
        const e = this.jt(t).Ct();
        return this.Ft.getRemoteKeysForTarget(t).size + e.addedDocuments.size - e.removedDocuments.size;
    }
    /**
     * Increment the number of acks needed from watch before we can consider the
     * server to be 'in-sync' with the client's active targets.
     */    Ot(t) {
        this.jt(t).Ot();
    }
    jt(t) {
        let e = this.Bt.get(t);
        return e || (e = new wi, this.Bt.set(t, e)), e;
    }
    ee(t) {
        let e = this.qt.get(t);
        return e || (e = new Ie(X), this.qt = this.qt.insert(t, e)), e;
    }
    /**
     * Verifies that the user is still interested in this target (by calling
     * `getTargetDataForTarget()`) and that we are not waiting for pending ADDs
     * from watch.
     */    Wt(t) {
        const e = null !== this.Yt(t);
        return e || C("WatchChangeAggregator", "Detected inactive target", t), e;
    }
    /**
     * Returns the TargetData for an active target (i.e. a target that the user
     * is still interested in that has no outstanding target change requests).
     */    Yt(t) {
        const e = this.Bt.get(t);
        return e && e.Vt ? null : this.Ft.ne(t);
    }
    /**
     * Resets the state of a Watch target to its initial state (e.g. sets
     * 'current' to false, clears the resume token and removes its target mapping
     * from all documents).
     */    Ht(t) {
        this.Bt.set(t, new wi);
        this.Ft.getRemoteKeysForTarget(t).forEach((e => {
            this.Qt(t, e, /*updatedDocument=*/ null);
        }));
    }
    /**
     * Returns whether the LocalStore considers the document to be part of the
     * specified target.
     */    te(t, e) {
        return this.Ft.getRemoteKeysForTarget(t).has(e);
    }
}

function mi() {
    return new ge(ct.comparator);
}

function gi() {
    return new ge(ct.comparator);
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const yi = (() => {
    const t = {
        asc: "ASCENDING",
        desc: "DESCENDING"
    };
    return t;
})(), pi = (() => {
    const t = {
        "<": "LESS_THAN",
        "<=": "LESS_THAN_OR_EQUAL",
        ">": "GREATER_THAN",
        ">=": "GREATER_THAN_OR_EQUAL",
        "==": "EQUAL",
        "!=": "NOT_EQUAL",
        "array-contains": "ARRAY_CONTAINS",
        in: "IN",
        "not-in": "NOT_IN",
        "array-contains-any": "ARRAY_CONTAINS_ANY"
    };
    return t;
})(), Ii = (() => {
    const t = {
        and: "AND",
        or: "OR"
    };
    return t;
})();

/**
 * This class generates JsonObject values for the Datastore API suitable for
 * sending to either GRPC stub methods or via the JSON/HTTP REST API.
 *
 * The serializer supports both Protobuf.js and Proto3 JSON formats. By
 * setting `useProto3Json` to true, the serializer will use the Proto3 JSON
 * format.
 *
 * For a description of the Proto3 JSON format check
 * https://developers.google.com/protocol-buffers/docs/proto3#json
 *
 * TODO(klimt): We can remove the databaseId argument if we keep the full
 * resource name in documents.
 */
class Ti {
    constructor(t, e) {
        this.databaseId = t, this.useProto3Json = e;
    }
}

/**
 * Returns a value for a Date that's appropriate to put into a proto.
 */
function Ei(t, e) {
    if (t.useProto3Json) {
        return `${new Date(1e3 * e.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + e.nanoseconds).slice(-9)}Z`;
    }
    return {
        seconds: "" + e.seconds,
        nanos: e.nanoseconds
    };
}

/**
 * Returns a value for bytes that's appropriate to put in a proto.
 *
 * Visible for testing.
 */
function Ai(t, e) {
    return t.useProto3Json ? e.toBase64() : e.toUint8Array();
}

/**
 * Returns a ByteString based on the proto string value.
 */ function Ri(t, e) {
    return Ei(t, e.toTimestamp());
}

function vi(t) {
    return $(!!t), st.fromTimestamp(function(t) {
        const e = Ve(t);
        return new nt(e.seconds, e.nanos);
    }(t));
}

function bi(t, e) {
    return function(t) {
        return new rt([ "projects", t.projectId, "databases", t.database ]);
    }(t).child("documents").child(e).canonicalString();
}

function Pi(t) {
    const e = rt.fromString(t);
    return $(Xi(e)), e;
}

function Vi(t, e) {
    return bi(t.databaseId, e.path);
}

function Si(t, e) {
    const n = Pi(e);
    if (n.get(1) !== t.databaseId.projectId) throw new L(B.INVALID_ARGUMENT, "Tried to deserialize key from different project: " + n.get(1) + " vs " + t.databaseId.projectId);
    if (n.get(3) !== t.databaseId.database) throw new L(B.INVALID_ARGUMENT, "Tried to deserialize key from different database: " + n.get(3) + " vs " + t.databaseId.database);
    return new ct(Ni(n));
}

function Di(t, e) {
    return bi(t.databaseId, e);
}

function Ci(t) {
    const e = Pi(t);
    // In v1beta1 queries for collections at the root did not have a trailing
    // "/documents". In v1 all resource paths contain "/documents". Preserve the
    // ability to read the v1beta1 form for compatibility with queries persisted
    // in the local target cache.
        return 4 === e.length ? rt.emptyPath() : Ni(e);
}

function xi(t) {
    return new rt([ "projects", t.databaseId.projectId, "databases", t.databaseId.database ]).canonicalString();
}

function Ni(t) {
    return $(t.length > 4 && "documents" === t.get(4)), t.popFirst(5);
}

/** Creates a Document proto from key and fields (but no create/update time) */ function ki(t, e, n) {
    return {
        name: Vi(t, e),
        fields: n.value.mapValue.fields
    };
}

function Oi(t, e, n) {
    const s = Si(t, e.name), i = vi(e.updateTime), r = e.createTime ? vi(e.createTime) : st.min(), o = new sn({
        mapValue: {
            fields: e.fields
        }
    }), u = on.newFoundDocument(s, i, r, o);
    return n && u.setHasCommittedMutations(), n ? u.setHasCommittedMutations() : u;
}

function $i(t, e) {
    return "found" in e ? function(t, e) {
        $(!!e.found), e.found.name, e.found.updateTime;
        const n = Si(t, e.found.name), s = vi(e.found.updateTime), i = e.found.createTime ? vi(e.found.createTime) : st.min(), r = new sn({
            mapValue: {
                fields: e.found.fields
            }
        });
        return on.newFoundDocument(n, s, i, r);
    }(t, e) : "missing" in e ? function(t, e) {
        $(!!e.missing), $(!!e.readTime);
        const n = Si(t, e.missing), s = vi(e.readTime);
        return on.newNoDocument(n, s);
    }(t, e) : O();
}

function Mi(t, e) {
    let n;
    if ("targetChange" in e) {
        e.targetChange;
        // proto3 default value is unset in JSON (undefined), so use 'NO_CHANGE'
        // if unset
        const s = function(t) {
            return "NO_CHANGE" === t ? 0 /* WatchTargetChangeState.NoChange */ : "ADD" === t ? 1 /* WatchTargetChangeState.Added */ : "REMOVE" === t ? 2 /* WatchTargetChangeState.Removed */ : "CURRENT" === t ? 3 /* WatchTargetChangeState.Current */ : "RESET" === t ? 4 /* WatchTargetChangeState.Reset */ : O();
        }(e.targetChange.targetChangeType || "NO_CHANGE"), i = e.targetChange.targetIds || [], r = function(t, e) {
            return t.useProto3Json ? ($(void 0 === e || "string" == typeof e), be.fromBase64String(e || "")) : ($(void 0 === e || e instanceof Uint8Array), 
            be.fromUint8Array(e || new Uint8Array));
        }(t, e.targetChange.resumeToken), o = e.targetChange.cause, u = o && function(t) {
            const e = void 0 === t.code ? B.UNKNOWN : oi(t.code);
            return new L(e, t.message || "");
        }
        /**
 * Returns a value for a number (or null) that's appropriate to put into
 * a google.protobuf.Int32Value proto.
 * DO NOT USE THIS FOR ANYTHING ELSE.
 * This method cheats. It's typed as returning "number" because that's what
 * our generated proto interfaces say Int32Value must be. But GRPC actually
 * expects a { value: <number> } struct.
 */ (o);
        n = new di(s, i, r, u || null);
    } else if ("documentChange" in e) {
        e.documentChange;
        const s = e.documentChange;
        s.document, s.document.name, s.document.updateTime;
        const i = Si(t, s.document.name), r = vi(s.document.updateTime), o = s.document.createTime ? vi(s.document.createTime) : st.min(), u = new sn({
            mapValue: {
                fields: s.document.fields
            }
        }), c = on.newFoundDocument(i, r, o, u), a = s.targetIds || [], h = s.removedTargetIds || [];
        n = new li(a, h, c.key, c);
    } else if ("documentDelete" in e) {
        e.documentDelete;
        const s = e.documentDelete;
        s.document;
        const i = Si(t, s.document), r = s.readTime ? vi(s.readTime) : st.min(), o = on.newNoDocument(i, r), u = s.removedTargetIds || [];
        n = new li([], u, o.key, o);
    } else if ("documentRemove" in e) {
        e.documentRemove;
        const s = e.documentRemove;
        s.document;
        const i = Si(t, s.document), r = s.removedTargetIds || [];
        n = new li([], r, i, null);
    } else {
        if (!("filter" in e)) return O();
        {
            e.filter;
            const t = e.filter;
            t.targetId;
            const s = t.count || 0, i = new ni(s), r = t.targetId;
            n = new fi(r, i);
        }
    }
    return n;
}

function Fi(t, e) {
    let n;
    if (e instanceof Ks) n = {
        update: ki(t, e.key, e.value)
    }; else if (e instanceof Ws) n = {
        delete: Vi(t, e.key)
    }; else if (e instanceof Gs) n = {
        update: ki(t, e.key, e.data),
        updateMask: Zi(e.fieldMask)
    }; else {
        if (!(e instanceof Hs)) return O();
        n = {
            verify: Vi(t, e.key)
        };
    }
    return e.fieldTransforms.length > 0 && (n.updateTransforms = e.fieldTransforms.map((t => function(t, e) {
        const n = e.transform;
        if (n instanceof Rs) return {
            fieldPath: e.field.canonicalString(),
            setToServerValue: "REQUEST_TIME"
        };
        if (n instanceof vs) return {
            fieldPath: e.field.canonicalString(),
            appendMissingElements: {
                values: n.elements
            }
        };
        if (n instanceof Ps) return {
            fieldPath: e.field.canonicalString(),
            removeAllFromArray: {
                values: n.elements
            }
        };
        if (n instanceof Ss) return {
            fieldPath: e.field.canonicalString(),
            increment: n._t
        };
        throw O();
    }(0, t)))), e.precondition.isNone || (n.currentDocument = function(t, e) {
        return void 0 !== e.updateTime ? {
            updateTime: Ri(t, e.updateTime)
        } : void 0 !== e.exists ? {
            exists: e.exists
        } : O();
    }(t, e.precondition)), n;
}

function Bi(t, e) {
    const n = e.currentDocument ? function(t) {
        return void 0 !== t.updateTime ? Os.updateTime(vi(t.updateTime)) : void 0 !== t.exists ? Os.exists(t.exists) : Os.none();
    }(e.currentDocument) : Os.none(), s = e.updateTransforms ? e.updateTransforms.map((e => function(t, e) {
        let n = null;
        if ("setToServerValue" in e) $("REQUEST_TIME" === e.setToServerValue), n = new Rs; else if ("appendMissingElements" in e) {
            const t = e.appendMissingElements.values || [];
            n = new vs(t);
        } else if ("removeAllFromArray" in e) {
            const t = e.removeAllFromArray.values || [];
            n = new Ps(t);
        } else "increment" in e ? n = new Ss(t, e.increment) : O();
        const s = ut.fromServerFormat(e.fieldPath);
        return new xs(s, n);
    }(t, e))) : [];
    if (e.update) {
        e.update.name;
        const i = Si(t, e.update.name), r = new sn({
            mapValue: {
                fields: e.update.fields
            }
        });
        if (e.updateMask) {
            const t = function(t) {
                const e = t.fieldPaths || [];
                return new Ae(e.map((t => ut.fromServerFormat(t))));
            }(e.updateMask);
            return new Gs(i, r, t, n, s);
        }
        return new Ks(i, r, n, s);
    }
    if (e.delete) {
        const s = Si(t, e.delete);
        return new Ws(s, n);
    }
    if (e.verify) {
        const s = Si(t, e.verify);
        return new Hs(s, n);
    }
    return O();
}

function Li(t, e) {
    return t && t.length > 0 ? ($(void 0 !== e), t.map((t => function(t, e) {
        // NOTE: Deletes don't have an updateTime.
        let n = t.updateTime ? vi(t.updateTime) : vi(e);
        return n.isEqual(st.min()) && (
        // The Firestore Emulator currently returns an update time of 0 for
        // deletes of non-existing documents (rather than null). This breaks the
        // test "get deleted doc while offline with source=cache" as NoDocuments
        // with version 0 are filtered by IndexedDb's RemoteDocumentCache.
        // TODO(#2149): Remove this when Emulator is fixed
        n = vi(e)), new ks(n, t.transformResults || []);
    }(t, e)))) : [];
}

function qi(t, e) {
    return {
        documents: [ Di(t, e.path) ]
    };
}

function Ui(t, e) {
    // Dissect the path into parent, collectionId, and optional key filter.
    const n = {
        structuredQuery: {}
    }, s = e.path;
    null !== e.collectionGroup ? (n.parent = Di(t, s), n.structuredQuery.from = [ {
        collectionId: e.collectionGroup,
        allDescendants: !0
    } ]) : (n.parent = Di(t, s.popLast()), n.structuredQuery.from = [ {
        collectionId: s.lastSegment()
    } ]);
    const i = function(t) {
        if (0 === t.length) return;
        return Yi(wn.create(t, "and" /* CompositeOperator.AND */));
    }(e.filters);
    i && (n.structuredQuery.where = i);
    const r = function(t) {
        if (0 === t.length) return;
        return t.map((t => 
        // visible for testing
        function(t) {
            return {
                field: Hi(t.field),
                direction: zi(t.dir)
            };
        }(t)));
    }(e.orderBy);
    r && (n.structuredQuery.orderBy = r);
    const o = function(t, e) {
        return t.useProto3Json || $t(e) ? e : {
            value: e
        };
    }
    /**
 * Returns a number (or null) from a google.protobuf.Int32Value proto.
 */ (t, e.limit);
    var u;
    return null !== o && (n.structuredQuery.limit = o), e.startAt && (n.structuredQuery.startAt = {
        before: (u = e.startAt).inclusive,
        values: u.position
    }), e.endAt && (n.structuredQuery.endAt = function(t) {
        return {
            before: !t.inclusive,
            values: t.position
        };
    }(e.endAt)), n;
}

function Ki(t) {
    let e = Ci(t.parent);
    const n = t.structuredQuery, s = n.from ? n.from.length : 0;
    let i = null;
    if (s > 0) {
        $(1 === s);
        const t = n.from[0];
        t.allDescendants ? i = t.collectionId : e = e.child(t.collectionId);
    }
    let r = [];
    n.where && (r = function(t) {
        const e = Qi(t);
        if (e instanceof wn && gn(e)) return e.getFilters();
        return [ e ];
    }(n.where));
    let o = [];
    n.orderBy && (o = n.orderBy.map((t => function(t) {
        return new hn(Ji(t.field), 
        // visible for testing
        function(t) {
            switch (t) {
              case "ASCENDING":
                return "asc" /* Direction.ASCENDING */;

              case "DESCENDING":
                return "desc" /* Direction.DESCENDING */;

              default:
                return;
            }
        }
        // visible for testing
        (t.direction));
    }
    // visible for testing
    (t))));
    let u = null;
    n.limit && (u = function(t) {
        let e;
        return e = "object" == typeof t ? t.value : t, $t(e) ? null : e;
    }(n.limit));
    let c = null;
    n.startAt && (c = function(t) {
        const e = !!t.before, n = t.values || [];
        return new un(n, e);
    }(n.startAt));
    let a = null;
    return n.endAt && (a = function(t) {
        const e = !t.before, n = t.values || [];
        return new un(n, e);
    }
    // visible for testing
    (n.endAt)), Ln(e, i, o, r, u, "F" /* LimitType.First */ , c, a);
}

function Gi(t, e) {
    const n = function(t, e) {
        switch (e) {
          case 0 /* TargetPurpose.Listen */ :
            return null;

          case 1 /* TargetPurpose.ExistenceFilterMismatch */ :
            return "existence-filter-mismatch";

          case 2 /* TargetPurpose.LimboResolution */ :
            return "limbo-document";

          default:
            return O();
        }
    }(0, e.purpose);
    return null == n ? null : {
        "goog-listen-tags": n
    };
}

function Qi(t) {
    return void 0 !== t.unaryFilter ? function(t) {
        switch (t.unaryFilter.op) {
          case "IS_NAN":
            const e = Ji(t.unaryFilter.field);
            return dn.create(e, "==" /* Operator.EQUAL */ , {
                doubleValue: NaN
            });

          case "IS_NULL":
            const n = Ji(t.unaryFilter.field);
            return dn.create(n, "==" /* Operator.EQUAL */ , {
                nullValue: "NULL_VALUE"
            });

          case "IS_NOT_NAN":
            const s = Ji(t.unaryFilter.field);
            return dn.create(s, "!=" /* Operator.NOT_EQUAL */ , {
                doubleValue: NaN
            });

          case "IS_NOT_NULL":
            const i = Ji(t.unaryFilter.field);
            return dn.create(i, "!=" /* Operator.NOT_EQUAL */ , {
                nullValue: "NULL_VALUE"
            });

          default:
            return O();
        }
    }(t) : void 0 !== t.fieldFilter ? function(t) {
        return dn.create(Ji(t.fieldFilter.field), function(t) {
            switch (t) {
              case "EQUAL":
                return "==" /* Operator.EQUAL */;

              case "NOT_EQUAL":
                return "!=" /* Operator.NOT_EQUAL */;

              case "GREATER_THAN":
                return ">" /* Operator.GREATER_THAN */;

              case "GREATER_THAN_OR_EQUAL":
                return ">=" /* Operator.GREATER_THAN_OR_EQUAL */;

              case "LESS_THAN":
                return "<" /* Operator.LESS_THAN */;

              case "LESS_THAN_OR_EQUAL":
                return "<=" /* Operator.LESS_THAN_OR_EQUAL */;

              case "ARRAY_CONTAINS":
                return "array-contains" /* Operator.ARRAY_CONTAINS */;

              case "IN":
                return "in" /* Operator.IN */;

              case "NOT_IN":
                return "not-in" /* Operator.NOT_IN */;

              case "ARRAY_CONTAINS_ANY":
                return "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */;

              default:
                return O();
            }
        }(t.fieldFilter.op), t.fieldFilter.value);
    }(t) : void 0 !== t.compositeFilter ? function(t) {
        return wn.create(t.compositeFilter.filters.map((t => Qi(t))), function(t) {
            switch (t) {
              case "AND":
                return "and" /* CompositeOperator.AND */;

              case "OR":
                return "or" /* CompositeOperator.OR */;

              default:
                return O();
            }
        }(t.compositeFilter.op));
    }(t) : O();
}

function zi(t) {
    return yi[t];
}

function ji(t) {
    return pi[t];
}

function Wi(t) {
    return Ii[t];
}

function Hi(t) {
    return {
        fieldPath: t.canonicalString()
    };
}

function Ji(t) {
    return ut.fromServerFormat(t.fieldPath);
}

function Yi(t) {
    return t instanceof dn ? function(t) {
        if ("==" /* Operator.EQUAL */ === t.op) {
            if (He(t.value)) return {
                unaryFilter: {
                    field: Hi(t.field),
                    op: "IS_NAN"
                }
            };
            if (We(t.value)) return {
                unaryFilter: {
                    field: Hi(t.field),
                    op: "IS_NULL"
                }
            };
        } else if ("!=" /* Operator.NOT_EQUAL */ === t.op) {
            if (He(t.value)) return {
                unaryFilter: {
                    field: Hi(t.field),
                    op: "IS_NOT_NAN"
                }
            };
            if (We(t.value)) return {
                unaryFilter: {
                    field: Hi(t.field),
                    op: "IS_NOT_NULL"
                }
            };
        }
        return {
            fieldFilter: {
                field: Hi(t.field),
                op: ji(t.op),
                value: t.value
            }
        };
    }(t) : t instanceof wn ? function(t) {
        const e = t.getFilters().map((t => Yi(t)));
        if (1 === e.length) return e[0];
        return {
            compositeFilter: {
                op: Wi(t.op),
                filters: e
            }
        };
    }(t) : O();
}

function Zi(t) {
    const e = [];
    return t.fields.forEach((t => e.push(t.canonicalString()))), {
        fieldPaths: e
    };
}

function Xi(t) {
    // Resource names have at least 4 components (project ID, database ID)
    return t.length >= 4 && "projects" === t.get(0) && "databases" === t.get(2);
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * An immutable set of metadata that the local store tracks for each target.
 */ class tr {
    constructor(
    /** The target being listened to. */
    t, 
    /**
     * The target ID to which the target corresponds; Assigned by the
     * LocalStore for user listens and by the SyncEngine for limbo watches.
     */
    e, 
    /** The purpose of the target. */
    n, 
    /**
     * The sequence number of the last transaction during which this target data
     * was modified.
     */
    s, 
    /** The latest snapshot version seen for this target. */
    i = st.min()
    /**
     * The maximum snapshot version at which the associated view
     * contained no limbo documents.
     */ , r = st.min()
    /**
     * An opaque, server-assigned token that allows watching a target to be
     * resumed after disconnecting without retransmitting all the data that
     * matches the target. The resume token essentially identifies a point in
     * time from which the server should resume sending results.
     */ , o = be.EMPTY_BYTE_STRING) {
        this.target = t, this.targetId = e, this.purpose = n, this.sequenceNumber = s, this.snapshotVersion = i, 
        this.lastLimboFreeSnapshotVersion = r, this.resumeToken = o;
    }
    /** Creates a new target data instance with an updated sequence number. */    withSequenceNumber(t) {
        return new tr(this.target, this.targetId, this.purpose, t, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken);
    }
    /**
     * Creates a new target data instance with an updated resume token and
     * snapshot version.
     */    withResumeToken(t, e) {
        return new tr(this.target, this.targetId, this.purpose, this.sequenceNumber, e, this.lastLimboFreeSnapshotVersion, t);
    }
    /**
     * Creates a new target data instance with an updated last limbo free
     * snapshot version number.
     */    withLastLimboFreeSnapshotVersion(t) {
        return new tr(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, t, this.resumeToken);
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** Serializer for values stored in the LocalStore. */ class er {
    constructor(t) {
        this.se = t;
    }
}

/** Decodes a remote document from storage locally to a Document. */ function nr(t, e) {
    let n;
    if (e.document) n = Oi(t.se, e.document, !!e.hasCommittedMutations); else if (e.noDocument) {
        const t = ct.fromSegments(e.noDocument.path), s = or(e.noDocument.readTime);
        n = on.newNoDocument(t, s), e.hasCommittedMutations && n.setHasCommittedMutations();
    } else {
        if (!e.unknownDocument) return O();
        {
            const t = ct.fromSegments(e.unknownDocument.path), s = or(e.unknownDocument.version);
            n = on.newUnknownDocument(t, s);
        }
    }
    return e.readTime && n.setReadTime(function(t) {
        const e = new nt(t[0], t[1]);
        return st.fromTimestamp(e);
    }(e.readTime)), n;
}

/** Encodes a document for storage locally. */ function sr(t, e) {
    const n = e.key, s = {
        prefixPath: n.getCollectionPath().popLast().toArray(),
        collectionGroup: n.collectionGroup,
        documentId: n.path.lastSegment(),
        readTime: ir(e.readTime),
        hasCommittedMutations: e.hasCommittedMutations
    };
    if (e.isFoundDocument()) s.document = function(t, e) {
        return {
            name: Vi(t, e.key),
            fields: e.data.value.mapValue.fields,
            updateTime: Ei(t, e.version.toTimestamp()),
            createTime: Ei(t, e.createTime.toTimestamp())
        };
    }(t.se, e); else if (e.isNoDocument()) s.noDocument = {
        path: n.path.toArray(),
        readTime: rr(e.version)
    }; else {
        if (!e.isUnknownDocument()) return O();
        s.unknownDocument = {
            path: n.path.toArray(),
            version: rr(e.version)
        };
    }
    return s;
}

function ir(t) {
    const e = t.toTimestamp();
    return [ e.seconds, e.nanoseconds ];
}

function rr(t) {
    const e = t.toTimestamp();
    return {
        seconds: e.seconds,
        nanoseconds: e.nanoseconds
    };
}

function or(t) {
    const e = new nt(t.seconds, t.nanoseconds);
    return st.fromTimestamp(e);
}

/** Encodes a batch of mutations into a DbMutationBatch for local storage. */
/** Decodes a DbMutationBatch into a MutationBatch */
function ur(t, e) {
    const n = (e.baseMutations || []).map((e => Bi(t.se, e)));
    // Squash old transform mutations into existing patch or set mutations.
    // The replacement of representing `transforms` with `update_transforms`
    // on the SDK means that old `transform` mutations stored in IndexedDB need
    // to be updated to `update_transforms`.
    // TODO(b/174608374): Remove this code once we perform a schema migration.
        for (let t = 0; t < e.mutations.length - 1; ++t) {
        const n = e.mutations[t];
        if (t + 1 < e.mutations.length && void 0 !== e.mutations[t + 1].transform) {
            const s = e.mutations[t + 1];
            n.updateTransforms = s.transform.fieldTransforms, e.mutations.splice(t + 1, 1), 
            ++t;
        }
    }
    const s = e.mutations.map((e => Bi(t.se, e))), i = nt.fromMillis(e.localWriteTimeMs);
    return new Js(e.batchId, i, n, s);
}

/** Decodes a DbTarget into TargetData */ function cr(t) {
    const e = or(t.readTime), n = void 0 !== t.lastLimboFreeSnapshotVersion ? or(t.lastLimboFreeSnapshotVersion) : st.min();
    let s;
    var i;
    return void 0 !== t.query.documents ? ($(1 === (i = t.query).documents.length), 
    s = jn(qn(Ci(i.documents[0])))) : s = function(t) {
        return jn(Ki(t));
    }(t.query), new tr(s, t.targetId, 0 /* TargetPurpose.Listen */ , t.lastListenSequenceNumber, e, n, be.fromBase64String(t.resumeToken));
}

/** Encodes TargetData into a DbTarget for storage locally. */ function ar(t, e) {
    const n = rr(e.snapshotVersion), s = rr(e.lastLimboFreeSnapshotVersion);
    let i;
    i = On(e.target) ? qi(t.se, e.target) : Ui(t.se, e.target);
    // We can't store the resumeToken as a ByteString in IndexedDb, so we
    // convert it to a base64 string for storage.
        const r = e.resumeToken.toBase64();
    // lastListenSequenceNumber is always 0 until we do real GC.
        return {
        targetId: e.targetId,
        canonicalId: Nn(e.target),
        readTime: n,
        resumeToken: r,
        lastListenSequenceNumber: e.sequenceNumber,
        lastLimboFreeSnapshotVersion: s,
        query: i
    };
}

/**
 * A helper function for figuring out what kind of query has been stored.
 */
/**
 * Encodes a `BundledQuery` from bundle proto to a Query object.
 *
 * This reconstructs the original query used to build the bundle being loaded,
 * including features exists only in SDKs (for example: limit-to-last).
 */
function hr(t) {
    const e = Ki({
        parent: t.parent,
        structuredQuery: t.structuredQuery
    });
    return "LAST" === t.limitType ? Hn(e, e.limit, "L" /* LimitType.Last */) : e;
}

/** Encodes a NamedQuery proto object to a NamedQuery model object. */
/** Encodes a DbDocumentOverlay object to an Overlay model object. */
function lr(t, e) {
    return new Zs(e.largestBatchId, Bi(t.se, e.overlayMutation));
}

/** Decodes an Overlay model object into a DbDocumentOverlay object. */
/**
 * Returns the DbDocumentOverlayKey corresponding to the given user and
 * document key.
 */
function fr(t, e) {
    const n = e.path.lastSegment();
    return [ t, Bt(e.path.popLast()), n ];
}

function dr(t, e, n, s) {
    return {
        indexId: t,
        uid: e.uid || "",
        sequenceNumber: n,
        readTime: rr(s.readTime),
        documentKey: Bt(s.documentKey.path),
        largestBatchId: s.largestBatchId
    };
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class wr {
    getBundleMetadata(t, e) {
        return _r(t).get(e).next((t => {
            if (t) return {
                id: (e = t).bundleId,
                createTime: or(e.createTime),
                version: e.version
            };
            /** Encodes a DbBundle to a BundleMetadata object. */
            var e;
            /** Encodes a BundleMetadata to a DbBundle. */        }));
    }
    saveBundleMetadata(t, e) {
        return _r(t).put({
            bundleId: (n = e).id,
            createTime: rr(vi(n.createTime)),
            version: n.version
        });
        var n;
        /** Encodes a DbNamedQuery to a NamedQuery. */    }
    getNamedQuery(t, e) {
        return mr(t).get(e).next((t => {
            if (t) return {
                name: (e = t).name,
                query: hr(e.bundledQuery),
                readTime: or(e.readTime)
            };
            var e;
            /** Encodes a NamedQuery from a bundle proto to a DbNamedQuery. */        }));
    }
    saveNamedQuery(t, e) {
        return mr(t).put(function(t) {
            return {
                name: t.name,
                readTime: rr(vi(t.readTime)),
                bundledQuery: t.bundledQuery
            };
        }(e));
    }
}

/**
 * Helper to get a typed SimpleDbStore for the bundles object store.
 */ function _r(t) {
    return de(t, "bundles");
}

/**
 * Helper to get a typed SimpleDbStore for the namedQueries object store.
 */ function mr(t) {
    return de(t, "namedQueries");
}

/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Implementation of DocumentOverlayCache using IndexedDb.
 */ class gr {
    /**
     * @param serializer - The document serializer.
     * @param userId - The userId for which we are accessing overlays.
     */
    constructor(t, e) {
        this.serializer = t, this.userId = e;
    }
    static ie(t, e) {
        const n = e.uid || "";
        return new gr(t, n);
    }
    getOverlay(t, e) {
        return yr(t).get(fr(this.userId, e)).next((t => t ? lr(this.serializer, t) : null));
    }
    getOverlays(t, e) {
        const n = as();
        return At.forEach(e, (e => this.getOverlay(t, e).next((t => {
            null !== t && n.set(e, t);
        })))).next((() => n));
    }
    saveOverlays(t, e, n) {
        const s = [];
        return n.forEach(((n, i) => {
            const r = new Zs(e, i);
            s.push(this.re(t, r));
        })), At.waitFor(s);
    }
    removeOverlaysForBatchId(t, e, n) {
        const s = new Set;
        // Get the set of unique collection paths.
                e.forEach((t => s.add(Bt(t.getCollectionPath()))));
        const i = [];
        return s.forEach((e => {
            const s = IDBKeyRange.bound([ this.userId, e, n ], [ this.userId, e, n + 1 ], 
            /*lowerOpen=*/ !1, 
            /*upperOpen=*/ !0);
            i.push(yr(t).J("collectionPathOverlayIndex", s));
        })), At.waitFor(i);
    }
    getOverlaysForCollection(t, e, n) {
        const s = as(), i = Bt(e), r = IDBKeyRange.bound([ this.userId, i, n ], [ this.userId, i, Number.POSITIVE_INFINITY ], 
        /*lowerOpen=*/ !0);
        return yr(t).j("collectionPathOverlayIndex", r).next((t => {
            for (const e of t) {
                const t = lr(this.serializer, e);
                s.set(t.getKey(), t);
            }
            return s;
        }));
    }
    getOverlaysForCollectionGroup(t, e, n, s) {
        const i = as();
        let r;
        // We want batch IDs larger than `sinceBatchId`, and so the lower bound
        // is not inclusive.
                const o = IDBKeyRange.bound([ this.userId, e, n ], [ this.userId, e, Number.POSITIVE_INFINITY ], 
        /*lowerOpen=*/ !0);
        return yr(t).Z({
            index: "collectionGroupOverlayIndex",
            range: o
        }, ((t, e, n) => {
            // We do not want to return partial batch overlays, even if the size
            // of the result set exceeds the given `count` argument. Therefore, we
            // continue to aggregate results even after the result size exceeds
            // `count` if there are more overlays from the `currentBatchId`.
            const o = lr(this.serializer, e);
            i.size() < s || o.largestBatchId === r ? (i.set(o.getKey(), o), r = o.largestBatchId) : n.done();
        })).next((() => i));
    }
    re(t, e) {
        return yr(t).put(function(t, e, n) {
            const [s, i, r] = fr(e, n.mutation.key);
            return {
                userId: e,
                collectionPath: i,
                documentId: r,
                collectionGroup: n.mutation.key.getCollectionGroup(),
                largestBatchId: n.largestBatchId,
                overlayMutation: Fi(t.se, n.mutation)
            };
        }(this.serializer, this.userId, e));
    }
}

/**
 * Helper to get a typed SimpleDbStore for the document overlay object store.
 */ function yr(t) {
    return de(t, "documentOverlays");
}

/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Note: This code is copied from the backend. Code that is not used by
// Firestore was removed.
/** Firestore index value writer.  */
class pr {
    constructor() {}
    // The write methods below short-circuit writing terminators for values
    // containing a (terminating) truncated value.
    // As an example, consider the resulting encoding for:
    // ["bar", [2, "foo"]] -> (STRING, "bar", TERM, ARRAY, NUMBER, 2, STRING, "foo", TERM, TERM, TERM)
    // ["bar", [2, truncated("foo")]] -> (STRING, "bar", TERM, ARRAY, NUMBER, 2, STRING, "foo", TRUNC)
    // ["bar", truncated(["foo"])] -> (STRING, "bar", TERM, ARRAY. STRING, "foo", TERM, TRUNC)
    /** Writes an index value.  */
    oe(t, e) {
        this.ue(t, e), 
        // Write separator to split index values
        // (see go/firestore-storage-format#encodings).
        e.ce();
    }
    ue(t, e) {
        if ("nullValue" in t) this.ae(e, 5); else if ("booleanValue" in t) this.ae(e, 10), 
        e.he(t.booleanValue ? 1 : 0); else if ("integerValue" in t) this.ae(e, 15), e.he(Se(t.integerValue)); else if ("doubleValue" in t) {
            const n = Se(t.doubleValue);
            isNaN(n) ? this.ae(e, 13) : (this.ae(e, 15), Mt(n) ? 
            // -0.0, 0 and 0.0 are all considered the same
            e.he(0) : e.he(n));
        } else if ("timestampValue" in t) {
            const n = t.timestampValue;
            this.ae(e, 20), "string" == typeof n ? e.le(n) : (e.le(`${n.seconds || ""}`), e.he(n.nanos || 0));
        } else if ("stringValue" in t) this.fe(t.stringValue, e), this.de(e); else if ("bytesValue" in t) this.ae(e, 30), 
        e.we(De(t.bytesValue)), this.de(e); else if ("referenceValue" in t) this._e(t.referenceValue, e); else if ("geoPointValue" in t) {
            const n = t.geoPointValue;
            this.ae(e, 45), e.he(n.latitude || 0), e.he(n.longitude || 0);
        } else "mapValue" in t ? Ze(t) ? this.ae(e, Number.MAX_SAFE_INTEGER) : (this.me(t.mapValue, e), 
        this.de(e)) : "arrayValue" in t ? (this.ge(t.arrayValue, e), this.de(e)) : O();
    }
    fe(t, e) {
        this.ae(e, 25), this.ye(t, e);
    }
    ye(t, e) {
        e.le(t);
    }
    me(t, e) {
        const n = t.fields || {};
        this.ae(e, 55);
        for (const t of Object.keys(n)) this.fe(t, e), this.ue(n[t], e);
    }
    ge(t, e) {
        const n = t.values || [];
        this.ae(e, 50);
        for (const t of n) this.ue(t, e);
    }
    _e(t, e) {
        this.ae(e, 37);
        ct.fromName(t).path.forEach((t => {
            this.ae(e, 60), this.ye(t, e);
        }));
    }
    ae(t, e) {
        t.he(e);
    }
    de(t) {
        // While the SDK does not implement truncation, the truncation marker is
        // used to terminate all variable length values (which are strings, bytes,
        // references, arrays and maps).
        t.he(2);
    }
}

pr.pe = new pr;

/**
 * Counts the number of zeros in a byte.
 *
 * Visible for testing.
 */
function Ir(t) {
    if (0 === t) return 8;
    let e = 0;
    return t >> 4 == 0 && (
    // Test if the first four bits are zero.
    e += 4, t <<= 4), t >> 6 == 0 && (
    // Test if the first two (or next two) bits are zero.
    e += 2, t <<= 2), t >> 7 == 0 && (
    // Test if the remaining bit is zero.
    e += 1), e;
}

/** Counts the number of leading zeros in the given byte array. */
/**
 * Returns the number of bytes required to store "value". Leading zero bytes
 * are skipped.
 */
function Tr(t) {
    // This is just the number of bytes for the unsigned representation of the number.
    const e = 64 - function(t) {
        let e = 0;
        for (let n = 0; n < 8; ++n) {
            const s = Ir(255 & t[n]);
            if (e += s, 8 !== s) break;
        }
        return e;
    }(t);
    return Math.ceil(e / 8);
}

/**
 * OrderedCodeWriter is a minimal-allocation implementation of the writing
 * behavior defined by the backend.
 *
 * The code is ported from its Java counterpart.
 */ class Er {
    constructor() {
        this.buffer = new Uint8Array(1024), this.position = 0;
    }
    Ie(t) {
        const e = t[Symbol.iterator]();
        let n = e.next();
        for (;!n.done; ) this.Te(n.value), n = e.next();
        this.Ee();
    }
    Ae(t) {
        const e = t[Symbol.iterator]();
        let n = e.next();
        for (;!n.done; ) this.Re(n.value), n = e.next();
        this.ve();
    }
    /** Writes utf8 bytes into this byte sequence, ascending. */    be(t) {
        for (const e of t) {
            const t = e.charCodeAt(0);
            if (t < 128) this.Te(t); else if (t < 2048) this.Te(960 | t >>> 6), this.Te(128 | 63 & t); else if (e < "\ud800" || "\udbff" < e) this.Te(480 | t >>> 12), 
            this.Te(128 | 63 & t >>> 6), this.Te(128 | 63 & t); else {
                const t = e.codePointAt(0);
                this.Te(240 | t >>> 18), this.Te(128 | 63 & t >>> 12), this.Te(128 | 63 & t >>> 6), 
                this.Te(128 | 63 & t);
            }
        }
        this.Ee();
    }
    /** Writes utf8 bytes into this byte sequence, descending */    Pe(t) {
        for (const e of t) {
            const t = e.charCodeAt(0);
            if (t < 128) this.Re(t); else if (t < 2048) this.Re(960 | t >>> 6), this.Re(128 | 63 & t); else if (e < "\ud800" || "\udbff" < e) this.Re(480 | t >>> 12), 
            this.Re(128 | 63 & t >>> 6), this.Re(128 | 63 & t); else {
                const t = e.codePointAt(0);
                this.Re(240 | t >>> 18), this.Re(128 | 63 & t >>> 12), this.Re(128 | 63 & t >>> 6), 
                this.Re(128 | 63 & t);
            }
        }
        this.ve();
    }
    Ve(t) {
        // Values are encoded with a single byte length prefix, followed by the
        // actual value in big-endian format with leading 0 bytes dropped.
        const e = this.Se(t), n = Tr(e);
        this.De(1 + n), this.buffer[this.position++] = 255 & n;
        // Write the length
        for (let t = e.length - n; t < e.length; ++t) this.buffer[this.position++] = 255 & e[t];
    }
    Ce(t) {
        // Values are encoded with a single byte length prefix, followed by the
        // inverted value in big-endian format with leading 0 bytes dropped.
        const e = this.Se(t), n = Tr(e);
        this.De(1 + n), this.buffer[this.position++] = ~(255 & n);
        // Write the length
        for (let t = e.length - n; t < e.length; ++t) this.buffer[this.position++] = ~(255 & e[t]);
    }
    /**
     * Writes the "infinity" byte sequence that sorts after all other byte
     * sequences written in ascending order.
     */    xe() {
        this.Ne(255), this.Ne(255);
    }
    /**
     * Writes the "infinity" byte sequence that sorts before all other byte
     * sequences written in descending order.
     */    ke() {
        this.Oe(255), this.Oe(255);
    }
    /**
     * Resets the buffer such that it is the same as when it was newly
     * constructed.
     */    reset() {
        this.position = 0;
    }
    seed(t) {
        this.De(t.length), this.buffer.set(t, this.position), this.position += t.length;
    }
    /** Makes a copy of the encoded bytes in this buffer.  */    $e() {
        return this.buffer.slice(0, this.position);
    }
    /**
     * Encodes `val` into an encoding so that the order matches the IEEE 754
     * floating-point comparison results with the following exceptions:
     *   -0.0 < 0.0
     *   all non-NaN < NaN
     *   NaN = NaN
     */    Se(t) {
        const e = 
        /** Converts a JavaScript number to a byte array (using big endian encoding). */
        function(t) {
            const e = new DataView(new ArrayBuffer(8));
            return e.setFloat64(0, t, /* littleEndian= */ !1), new Uint8Array(e.buffer);
        }(t), n = 0 != (128 & e[0]);
        // Check if the first bit is set. We use a bit mask since value[0] is
        // encoded as a number from 0 to 255.
                // Revert the two complement to get natural ordering
        e[0] ^= n ? 255 : 128;
        for (let t = 1; t < e.length; ++t) e[t] ^= n ? 255 : 0;
        return e;
    }
    /** Writes a single byte ascending to the buffer. */    Te(t) {
        const e = 255 & t;
        0 === e ? (this.Ne(0), this.Ne(255)) : 255 === e ? (this.Ne(255), this.Ne(0)) : this.Ne(e);
    }
    /** Writes a single byte descending to the buffer.  */    Re(t) {
        const e = 255 & t;
        0 === e ? (this.Oe(0), this.Oe(255)) : 255 === e ? (this.Oe(255), this.Oe(0)) : this.Oe(t);
    }
    Ee() {
        this.Ne(0), this.Ne(1);
    }
    ve() {
        this.Oe(0), this.Oe(1);
    }
    Ne(t) {
        this.De(1), this.buffer[this.position++] = t;
    }
    Oe(t) {
        this.De(1), this.buffer[this.position++] = ~t;
    }
    De(t) {
        const e = t + this.position;
        if (e <= this.buffer.length) return;
        // Try doubling.
                let n = 2 * this.buffer.length;
        // Still not big enough? Just allocate the right size.
                n < e && (n = e);
        // Create the new buffer.
                const s = new Uint8Array(n);
        s.set(this.buffer), // copy old data
        this.buffer = s;
    }
}

class Ar {
    constructor(t) {
        this.Me = t;
    }
    we(t) {
        this.Me.Ie(t);
    }
    le(t) {
        this.Me.be(t);
    }
    he(t) {
        this.Me.Ve(t);
    }
    ce() {
        this.Me.xe();
    }
}

class Rr {
    constructor(t) {
        this.Me = t;
    }
    we(t) {
        this.Me.Ae(t);
    }
    le(t) {
        this.Me.Pe(t);
    }
    he(t) {
        this.Me.Ce(t);
    }
    ce() {
        this.Me.ke();
    }
}

/**
 * Implements `DirectionalIndexByteEncoder` using `OrderedCodeWriter` for the
 * actual encoding.
 */ class vr {
    constructor() {
        this.Me = new Er, this.Fe = new Ar(this.Me), this.Be = new Rr(this.Me);
    }
    seed(t) {
        this.Me.seed(t);
    }
    Le(t) {
        return 0 /* IndexKind.ASCENDING */ === t ? this.Fe : this.Be;
    }
    $e() {
        return this.Me.$e();
    }
    reset() {
        this.Me.reset();
    }
}

/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** Represents an index entry saved by the SDK in persisted storage. */ class br {
    constructor(t, e, n, s) {
        this.indexId = t, this.documentKey = e, this.arrayValue = n, this.directionalValue = s;
    }
    /**
     * Returns an IndexEntry entry that sorts immediately after the current
     * directional value.
     */    qe() {
        const t = this.directionalValue.length, e = 0 === t || 255 === this.directionalValue[t - 1] ? t + 1 : t, n = new Uint8Array(e);
        return n.set(this.directionalValue, 0), e !== t ? n.set([ 0 ], this.directionalValue.length) : ++n[n.length - 1], 
        new br(this.indexId, this.documentKey, this.arrayValue, n);
    }
}

function Pr(t, e) {
    let n = t.indexId - e.indexId;
    return 0 !== n ? n : (n = Vr(t.arrayValue, e.arrayValue), 0 !== n ? n : (n = Vr(t.directionalValue, e.directionalValue), 
    0 !== n ? n : ct.comparator(t.documentKey, e.documentKey)));
}

function Vr(t, e) {
    for (let n = 0; n < t.length && n < e.length; ++n) {
        const s = t[n] - e[n];
        if (0 !== s) return s;
    }
    return t.length - e.length;
}

/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A light query planner for Firestore.
 *
 * This class matches a `FieldIndex` against a Firestore Query `Target`. It
 * determines whether a given index can be used to serve the specified target.
 *
 * The following table showcases some possible index configurations:
 *
 * Query                                               | Index
 * -----------------------------------------------------------------------------
 * where('a', '==', 'a').where('b', '==', 'b')         | a ASC, b DESC
 * where('a', '==', 'a').where('b', '==', 'b')         | a ASC
 * where('a', '==', 'a').where('b', '==', 'b')         | b DESC
 * where('a', '>=', 'a').orderBy('a')                  | a ASC
 * where('a', '>=', 'a').orderBy('a', 'desc')          | a DESC
 * where('a', '>=', 'a').orderBy('a').orderBy('b')     | a ASC, b ASC
 * where('a', '>=', 'a').orderBy('a').orderBy('b')     | a ASC
 * where('a', 'array-contains', 'a').orderBy('b')      | a CONTAINS, b ASCENDING
 * where('a', 'array-contains', 'a').orderBy('b')      | a CONTAINS
 */ class Sr {
    constructor(t) {
        this.collectionId = null != t.collectionGroup ? t.collectionGroup : t.path.lastSegment(), 
        this.Ue = t.orderBy, this.Ke = [];
        for (const e of t.filters) {
            const t = e;
            t.isInequality() ? this.Ge = t : this.Ke.push(t);
        }
    }
    /**
     * Returns whether the index can be used to serve the TargetIndexMatcher's
     * target.
     *
     * An index is considered capable of serving the target when:
     * - The target uses all index segments for its filters and orderBy clauses.
     *   The target can have additional filter and orderBy clauses, but not
     *   fewer.
     * - If an ArrayContains/ArrayContainsAnyfilter is used, the index must also
     *   have a corresponding `CONTAINS` segment.
     * - All directional index segments can be mapped to the target as a series of
     *   equality filters, a single inequality filter and a series of orderBy
     *   clauses.
     * - The segments that represent the equality filters may appear out of order.
     * - The optional segment for the inequality filter must appear after all
     *   equality segments.
     * - The segments that represent that orderBy clause of the target must appear
     *   in order after all equality and inequality segments. Single orderBy
     *   clauses cannot be skipped, but a continuous orderBy suffix may be
     *   omitted.
     */    Qe(t) {
        $(t.collectionGroup === this.collectionId);
        // If there is an array element, find a matching filter.
        const e = ht(t);
        if (void 0 !== e && !this.ze(e)) return !1;
        const n = lt(t);
        let s = 0, i = 0;
        // Process all equalities first. Equalities can appear out of order.
        for (;s < n.length && this.ze(n[s]); ++s) ;
        // If we already have processed all segments, all segments are used to serve
        // the equality filters and we do not need to map any segments to the
        // target's inequality and orderBy clauses.
                if (s === n.length) return !0;
        // If there is an inequality filter, the next segment must match both the
        // filter and the first orderBy clause.
                if (void 0 !== this.Ge) {
            const t = n[s];
            if (!this.je(this.Ge, t) || !this.We(this.Ue[i++], t)) return !1;
            ++s;
        }
        // All remaining segments need to represent the prefix of the target's
        // orderBy.
                for (;s < n.length; ++s) {
            const t = n[s];
            if (i >= this.Ue.length || !this.We(this.Ue[i++], t)) return !1;
        }
        return !0;
    }
    ze(t) {
        for (const e of this.Ke) if (this.je(e, t)) return !0;
        return !1;
    }
    je(t, e) {
        if (void 0 === t || !t.field.isEqual(e.fieldPath)) return !1;
        const n = "array-contains" /* Operator.ARRAY_CONTAINS */ === t.op || "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ === t.op;
        return 2 /* IndexKind.CONTAINS */ === e.kind === n;
    }
    We(t, e) {
        return !!t.field.isEqual(e.fieldPath) && (0 /* IndexKind.ASCENDING */ === e.kind && "asc" /* Direction.ASCENDING */ === t.dir || 1 /* IndexKind.DESCENDING */ === e.kind && "desc" /* Direction.DESCENDING */ === t.dir);
    }
}

/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Provides utility functions that help with boolean logic transformations needed for handling
 * complex filters used in queries.
 */
/**
 * The `in` filter is only a syntactic sugar over a disjunction of equalities. For instance: `a in
 * [1,2,3]` is in fact `a==1 || a==2 || a==3`. This method expands any `in` filter in the given
 * input into a disjunction of equality filters and returns the expanded filter.
 */ function Dr(t) {
    var e, n;
    if ($(t instanceof dn || t instanceof wn), t instanceof dn) {
        if (t instanceof Vn) {
            const s = (null === (n = null === (e = t.value.arrayValue) || void 0 === e ? void 0 : e.values) || void 0 === n ? void 0 : n.map((e => dn.create(t.field, "==" /* Operator.EQUAL */ , e)))) || [];
            return wn.create(s, "or" /* CompositeOperator.OR */);
        }
        // We have reached other kinds of field filters.
        return t;
    }
    // We have a composite filter.
        const s = t.filters.map((t => Dr(t)));
    return wn.create(s, t.op);
}

/**
 * Given a composite filter, returns the list of terms in its disjunctive normal form.
 *
 * <p>Each element in the return value is one term of the resulting DNF. For instance: For the
 * input: (A || B) && C, the DNF form is: (A && C) || (B && C), and the return value is a list
 * with two elements: a composite filter that performs (A && C), and a composite filter that
 * performs (B && C).
 *
 * @param filter the composite filter to calculate DNF transform for.
 * @return the terms in the DNF transform.
 */ function Cr(t) {
    if (0 === t.getFilters().length) return [];
    const e = Or(Dr(t));
    return $(kr(e)), xr(e) || Nr(e) ? [ e ] : e.getFilters();
}

/** Returns true if the given filter is a single field filter. e.g. (a == 10). */ function xr(t) {
    return t instanceof dn;
}

/**
 * Returns true if the given filter is the conjunction of one or more field filters. e.g. (a == 10
 * && b == 20)
 */ function Nr(t) {
    return t instanceof wn && gn(t);
}

/**
 * Returns whether or not the given filter is in disjunctive normal form (DNF).
 *
 * <p>In boolean logic, a disjunctive normal form (DNF) is a canonical normal form of a logical
 * formula consisting of a disjunction of conjunctions; it can also be described as an OR of ANDs.
 *
 * <p>For more info, visit: https://en.wikipedia.org/wiki/Disjunctive_normal_form
 */ function kr(t) {
    return xr(t) || Nr(t) || 
    /**
 * Returns true if the given filter is the disjunction of one or more "flat conjunctions" and
 * field filters. e.g. (a == 10) || (b==20 && c==30)
 */
    function(t) {
        if (t instanceof wn && mn(t)) {
            for (const e of t.getFilters()) if (!xr(e) && !Nr(e)) return !1;
            return !0;
        }
        return !1;
    }(t);
}

function Or(t) {
    if ($(t instanceof dn || t instanceof wn), t instanceof dn) return t;
    if (1 === t.filters.length) return Or(t.filters[0]);
    // Compute DNF for each of the subfilters first
        const e = t.filters.map((t => Or(t)));
    let n = wn.create(e, t.op);
    return n = Fr(n), kr(n) ? n : ($(n instanceof wn), $(_n(n)), $(n.filters.length > 1), 
    n.filters.reduce(((t, e) => $r(t, e))));
}

function $r(t, e) {
    let n;
    return $(t instanceof dn || t instanceof wn), $(e instanceof dn || e instanceof wn), 
    // FieldFilter FieldFilter
    n = t instanceof dn ? e instanceof dn ? function(t, e) {
        // Conjunction distribution for two field filters is the conjunction of them.
        return wn.create([ t, e ], "and" /* CompositeOperator.AND */);
    }(t, e) : Mr(t, e) : e instanceof dn ? Mr(e, t) : function(t, e) {
        // There are four cases:
        // (A & B) & (C & D) --> (A & B & C & D)
        // (A & B) & (C | D) --> (A & B & C) | (A & B & D)
        // (A | B) & (C & D) --> (C & D & A) | (C & D & B)
        // (A | B) & (C | D) --> (A & C) | (A & D) | (B & C) | (B & D)
        // Case 1 is a merge.
        if ($(t.filters.length > 0 && e.filters.length > 0), _n(t) && _n(e)) return Tn(t, e.getFilters());
        // Case 2,3,4 all have at least one side (lhs or rhs) that is a disjunction. In all three cases
        // we should take each element of the disjunction and distribute it over the other side, and
        // return the disjunction of the distribution results.
                const n = mn(t) ? t : e, s = mn(t) ? e : t, i = n.filters.map((t => $r(t, s)));
        return wn.create(i, "or" /* CompositeOperator.OR */);
    }(t, e), Fr(n);
}

function Mr(t, e) {
    // There are two cases:
    // A & (B & C) --> (A & B & C)
    // A & (B | C) --> (A & B) | (A & C)
    if (_n(e)) 
    // Case 1
    return Tn(e, t.getFilters());
    {
        // Case 2
        const n = e.filters.map((e => $r(t, e)));
        return wn.create(n, "or" /* CompositeOperator.OR */);
    }
}

/**
 * Applies the associativity property to the given filter and returns the resulting filter.
 *
 * <ul>
 *   <li>A | (B | C) == (A | B) | C == (A | B | C)
 *   <li>A & (B & C) == (A & B) & C == (A & B & C)
 * </ul>
 *
 * <p>For more info, visit: https://en.wikipedia.org/wiki/Associative_property#Propositional_logic
 */ function Fr(t) {
    if ($(t instanceof dn || t instanceof wn), t instanceof dn) return t;
    const e = t.getFilters();
    // If the composite filter only contains 1 filter, apply associativity to it.
        if (1 === e.length) return Fr(e[0]);
    // Associativity applied to a flat composite filter results is itself.
        if (yn(t)) return t;
    // First apply associativity to all subfilters. This will in turn recursively apply
    // associativity to all nested composite filters and field filters.
        const n = e.map((t => Fr(t))), s = [];
    // For composite subfilters that perform the same kind of logical operation as `compositeFilter`
    // take out their filters and add them to `compositeFilter`. For example:
    // compositeFilter = (A | (B | C | D))
    // compositeSubfilter = (B | C | D)
    // Result: (A | B | C | D)
    // Note that the `compositeSubfilter` has been eliminated, and its filters (B, C, D) have been
    // added to the top-level "compositeFilter".
        return n.forEach((e => {
        e instanceof dn ? s.push(e) : e instanceof wn && (e.op === t.op ? 
        // compositeFilter: (A | (B | C))
        // compositeSubfilter: (B | C)
        // Result: (A | B | C)
        s.push(...e.filters) : 
        // compositeFilter: (A | (B & C))
        // compositeSubfilter: (B & C)
        // Result: (A | (B & C))
        s.push(e));
    })), 1 === s.length ? s[0] : wn.create(s, t.op);
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * An in-memory implementation of IndexManager.
 */ class Br {
    constructor() {
        this.He = new Lr;
    }
    addToCollectionParentIndex(t, e) {
        return this.He.add(e), At.resolve();
    }
    getCollectionParents(t, e) {
        return At.resolve(this.He.getEntries(e));
    }
    addFieldIndex(t, e) {
        // Field indices are not supported with memory persistence.
        return At.resolve();
    }
    deleteFieldIndex(t, e) {
        // Field indices are not supported with memory persistence.
        return At.resolve();
    }
    getDocumentsMatchingTarget(t, e) {
        // Field indices are not supported with memory persistence.
        return At.resolve(null);
    }
    getIndexType(t, e) {
        // Field indices are not supported with memory persistence.
        return At.resolve(0 /* IndexType.NONE */);
    }
    getFieldIndexes(t, e) {
        // Field indices are not supported with memory persistence.
        return At.resolve([]);
    }
    getNextCollectionGroupToUpdate(t) {
        // Field indices are not supported with memory persistence.
        return At.resolve(null);
    }
    getMinOffset(t, e) {
        return At.resolve(yt.min());
    }
    getMinOffsetFromCollectionGroup(t, e) {
        return At.resolve(yt.min());
    }
    updateCollectionGroup(t, e, n) {
        // Field indices are not supported with memory persistence.
        return At.resolve();
    }
    updateIndexEntries(t, e) {
        // Field indices are not supported with memory persistence.
        return At.resolve();
    }
}

/**
 * Internal implementation of the collection-parent index exposed by MemoryIndexManager.
 * Also used for in-memory caching by IndexedDbIndexManager and initial index population
 * in indexeddb_schema.ts
 */ class Lr {
    constructor() {
        this.index = {};
    }
    // Returns false if the entry already existed.
    add(t) {
        const e = t.lastSegment(), n = t.popLast(), s = this.index[e] || new Ie(rt.comparator), i = !s.has(n);
        return this.index[e] = s.add(n), i;
    }
    has(t) {
        const e = t.lastSegment(), n = t.popLast(), s = this.index[e];
        return s && s.has(n);
    }
    getEntries(t) {
        return (this.index[t] || new Ie(rt.comparator)).toArray();
    }
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const qr = new Uint8Array(0);

/**
 * A persisted implementation of IndexManager.
 *
 * PORTING NOTE: Unlike iOS and Android, the Web SDK does not memoize index
 * data as it supports multi-tab access.
 */
class Ur {
    constructor(t, e) {
        this.user = t, this.databaseId = e, 
        /**
         * An in-memory copy of the index entries we've already written since the SDK
         * launched. Used to avoid re-writing the same entry repeatedly.
         *
         * This is *NOT* a complete cache of what's in persistence and so can never be
         * used to satisfy reads.
         */
        this.Je = new Lr, 
        /**
         * Maps from a target to its equivalent list of sub-targets. Each sub-target
         * contains only one term from the target's disjunctive normal form (DNF).
         */
        this.Ye = new ss((t => Nn(t)), ((t, e) => kn(t, e))), this.uid = t.uid || "";
    }
    /**
     * Adds a new entry to the collection parent index.
     *
     * Repeated calls for the same collectionPath should be avoided within a
     * transaction as IndexedDbIndexManager only caches writes once a transaction
     * has been committed.
     */    addToCollectionParentIndex(t, e) {
        if (!this.Je.has(e)) {
            const n = e.lastSegment(), s = e.popLast();
            t.addOnCommittedListener((() => {
                // Add the collection to the in memory cache only if the transaction was
                // successfully committed.
                this.Je.add(e);
            }));
            const i = {
                collectionId: n,
                parent: Bt(s)
            };
            return Kr(t).put(i);
        }
        return At.resolve();
    }
    getCollectionParents(t, e) {
        const n = [], s = IDBKeyRange.bound([ e, "" ], [ et(e), "" ], 
        /*lowerOpen=*/ !1, 
        /*upperOpen=*/ !0);
        return Kr(t).j(s).next((t => {
            for (const s of t) {
                // This collectionId guard shouldn't be necessary (and isn't as long
                // as we're running in a real browser), but there's a bug in
                // indexeddbshim that breaks our range in our tests running in node:
                // https://github.com/axemclion/IndexedDBShim/issues/334
                if (s.collectionId !== e) break;
                n.push(Ut(s.parent));
            }
            return n;
        }));
    }
    addFieldIndex(t, e) {
        // TODO(indexing): Verify that the auto-incrementing index ID works in
        // Safari & Firefox.
        const n = Qr(t), s = function(t) {
            return {
                indexId: t.indexId,
                collectionGroup: t.collectionGroup,
                fields: t.fields.map((t => [ t.fieldPath.canonicalString(), t.kind ]))
            };
        }(e);
        delete s.indexId;
        // `indexId` is auto-populated by IndexedDb
        const i = n.add(s);
        if (e.indexState) {
            const n = zr(t);
            return i.next((t => {
                n.put(dr(t, this.user, e.indexState.sequenceNumber, e.indexState.offset));
            }));
        }
        return i.next();
    }
    deleteFieldIndex(t, e) {
        const n = Qr(t), s = zr(t), i = Gr(t);
        return n.delete(e.indexId).next((() => s.delete(IDBKeyRange.bound([ e.indexId ], [ e.indexId + 1 ], 
        /*lowerOpen=*/ !1, 
        /*upperOpen=*/ !0)))).next((() => i.delete(IDBKeyRange.bound([ e.indexId ], [ e.indexId + 1 ], 
        /*lowerOpen=*/ !1, 
        /*upperOpen=*/ !0))));
    }
    getDocumentsMatchingTarget(t, e) {
        const n = Gr(t);
        let s = !0;
        const i = new Map;
        return At.forEach(this.Ze(e), (e => this.Xe(t, e).next((t => {
            s && (s = !!t), i.set(e, t);
        })))).next((() => {
            if (s) {
                let t = ws();
                const s = [];
                return At.forEach(i, ((i, r) => {
                    var o;
                    C("IndexedDbIndexManager", `Using index ${o = i, `id=${o.indexId}|cg=${o.collectionGroup}|f=${o.fields.map((t => `${t.fieldPath}:${t.kind}`)).join(",")}`} to execute ${Nn(e)}`);
                    const u = function(t, e) {
                        const n = ht(e);
                        if (void 0 === n) return null;
                        for (const e of $n(t, n.fieldPath)) switch (e.op) {
                          case "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ :
                            return e.value.arrayValue.values || [];

                          case "array-contains" /* Operator.ARRAY_CONTAINS */ :
                            return [ e.value ];
                            // Remaining filters are not array filters.
                                                }
                        return null;
                    }
                    /**
 * Returns the list of values that are used in != or NOT_IN filters. Returns
 * `null` if there are no such filters.
 */ (r, i), c = function(t, e) {
                        const n = new Map;
                        for (const s of lt(e)) for (const e of $n(t, s.fieldPath)) switch (e.op) {
                          case "==" /* Operator.EQUAL */ :
                          case "in" /* Operator.IN */ :
                            // Encode equality prefix, which is encoded in the index value before
                            // the inequality (e.g. `a == 'a' && b != 'b'` is encoded to
                            // `value != 'ab'`).
                            n.set(s.fieldPath.canonicalString(), e.value);
                            break;

                          case "not-in" /* Operator.NOT_IN */ :
                          case "!=" /* Operator.NOT_EQUAL */ :
                            // NotIn/NotEqual is always a suffix. There cannot be any remaining
                            // segments and hence we can return early here.
                            return n.set(s.fieldPath.canonicalString(), e.value), Array.from(n.values());
                            // Remaining filters cannot be used as notIn bounds.
                                                }
                        return null;
                    }
                    /**
 * Returns a lower bound of field values that can be used as a starting point to
 * scan the index defined by `fieldIndex`. Returns `MIN_VALUE` if no lower bound
 * exists.
 */ (r, i), a = function(t, e) {
                        const n = [];
                        let s = !0;
                        // For each segment, retrieve a lower bound if there is a suitable filter or
                        // startAt.
                                                for (const i of lt(e)) {
                            const e = 0 /* IndexKind.ASCENDING */ === i.kind ? Mn(t, i.fieldPath, t.startAt) : Fn(t, i.fieldPath, t.startAt);
                            n.push(e.value), s && (s = e.inclusive);
                        }
                        return new un(n, s);
                    }
                    /**
 * Returns an upper bound of field values that can be used as an ending point
 * when scanning the index defined by `fieldIndex`. Returns `MAX_VALUE` if no
 * upper bound exists.
 */ (r, i), h = function(t, e) {
                        const n = [];
                        let s = !0;
                        // For each segment, retrieve an upper bound if there is a suitable filter or
                        // endAt.
                                                for (const i of lt(e)) {
                            const e = 0 /* IndexKind.ASCENDING */ === i.kind ? Fn(t, i.fieldPath, t.endAt) : Mn(t, i.fieldPath, t.endAt);
                            n.push(e.value), s && (s = e.inclusive);
                        }
                        return new un(n, s);
                    }(r, i), l = this.tn(i, r, a), f = this.tn(i, r, h), d = this.en(i, r, c), w = this.nn(i.indexId, u, l, a.inclusive, f, h.inclusive, d);
                    return At.forEach(w, (i => n.H(i, e.limit).next((e => {
                        e.forEach((e => {
                            const n = ct.fromSegments(e.documentKey);
                            t.has(n) || (t = t.add(n), s.push(n));
                        }));
                    }))));
                })).next((() => s));
            }
            return At.resolve(null);
        }));
    }
    Ze(t) {
        let e = this.Ye.get(t);
        if (e) return e;
        if (0 === t.filters.length) e = [ t ]; else {
            e = Cr(wn.create(t.filters, "and" /* CompositeOperator.AND */)).map((e => xn(t.path, t.collectionGroup, t.orderBy, e.getFilters(), t.limit, t.startAt, t.endAt)));
        }
        return this.Ye.set(t, e), e;
    }
    /**
     * Constructs a key range query on `DbIndexEntryStore` that unions all
     * bounds.
     */    nn(t, e, n, s, i, r, o) {
        // The number of total index scans we union together. This is similar to a
        // distributed normal form, but adapted for array values. We create a single
        // index range per value in an ARRAY_CONTAINS or ARRAY_CONTAINS_ANY filter
        // combined with the values from the query bounds.
        const u = (null != e ? e.length : 1) * Math.max(n.length, i.length), c = u / (null != e ? e.length : 1), a = [];
        for (let h = 0; h < u; ++h) {
            const u = e ? this.sn(e[h / c]) : qr, l = this.rn(t, u, n[h % c], s), f = this.on(t, u, i[h % c], r), d = o.map((e => this.rn(t, u, e, 
            /* inclusive= */ !0)));
            a.push(...this.createRange(l, f, d));
        }
        return a;
    }
    /** Generates the lower bound for `arrayValue` and `directionalValue`. */    rn(t, e, n, s) {
        const i = new br(t, ct.empty(), e, n);
        return s ? i : i.qe();
    }
    /** Generates the upper bound for `arrayValue` and `directionalValue`. */    on(t, e, n, s) {
        const i = new br(t, ct.empty(), e, n);
        return s ? i.qe() : i;
    }
    Xe(t, e) {
        const n = new Sr(e), s = null != e.collectionGroup ? e.collectionGroup : e.path.lastSegment();
        return this.getFieldIndexes(t, s).next((t => {
            // Return the index with the most number of segments.
            let e = null;
            for (const s of t) {
                n.Qe(s) && (!e || s.fields.length > e.fields.length) && (e = s);
            }
            return e;
        }));
    }
    getIndexType(t, e) {
        let n = 2 /* IndexType.FULL */;
        const s = this.Ze(e);
        return At.forEach(s, (e => this.Xe(t, e).next((t => {
            t ? 0 /* IndexType.NONE */ !== n && t.fields.length < function(t) {
                let e = new Ie(ut.comparator), n = !1;
                for (const s of t.filters) for (const t of s.getFlattenedFilters()) 
                // __name__ is not an explicit segment of any index, so we don't need to
                // count it.
                t.field.isKeyField() || (
                // ARRAY_CONTAINS or ARRAY_CONTAINS_ANY filters must be counted separately.
                // For instance, it is possible to have an index for "a ARRAY a ASC". Even
                // though these are on the same field, they should be counted as two
                // separate segments in an index.
                "array-contains" /* Operator.ARRAY_CONTAINS */ === t.op || "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ === t.op ? n = !0 : e = e.add(t.field));
                for (const n of t.orderBy) 
                // __name__ is not an explicit segment of any index, so we don't need to
                // count it.
                n.field.isKeyField() || (e = e.add(n.field));
                return e.size + (n ? 1 : 0);
            }(e) && (n = 1 /* IndexType.PARTIAL */) : n = 0 /* IndexType.NONE */;
        })))).next((() => 
        // OR queries have more than one sub-target (one sub-target per DNF term). We currently consider
        // OR queries that have a `limit` to have a partial index. For such queries we perform sorting
        // and apply the limit in memory as a post-processing step.
        function(t) {
            return null !== t.limit;
        }(e) && s.length > 1 && 2 /* IndexType.FULL */ === n ? 1 /* IndexType.PARTIAL */ : n));
    }
    /**
     * Returns the byte encoded form of the directional values in the field index.
     * Returns `null` if the document does not have all fields specified in the
     * index.
     */    un(t, e) {
        const n = new vr;
        for (const s of lt(t)) {
            const t = e.data.field(s.fieldPath);
            if (null == t) return null;
            const i = n.Le(s.kind);
            pr.pe.oe(t, i);
        }
        return n.$e();
    }
    /** Encodes a single value to the ascending index format. */    sn(t) {
        const e = new vr;
        return pr.pe.oe(t, e.Le(0 /* IndexKind.ASCENDING */)), e.$e();
    }
    /**
     * Returns an encoded form of the document key that sorts based on the key
     * ordering of the field index.
     */    cn(t, e) {
        const n = new vr;
        return pr.pe.oe(Qe(this.databaseId, e), n.Le(function(t) {
            const e = lt(t);
            return 0 === e.length ? 0 /* IndexKind.ASCENDING */ : e[e.length - 1].kind;
        }(t))), n.$e();
    }
    /**
     * Encodes the given field values according to the specification in `target`.
     * For IN queries, a list of possible values is returned.
     */    en(t, e, n) {
        if (null === n) return [];
        let s = [];
        s.push(new vr);
        let i = 0;
        for (const r of lt(t)) {
            const t = n[i++];
            for (const n of s) if (this.an(e, r.fieldPath) && je(t)) s = this.hn(s, r, t); else {
                const e = n.Le(r.kind);
                pr.pe.oe(t, e);
            }
        }
        return this.ln(s);
    }
    /**
     * Encodes the given bounds according to the specification in `target`. For IN
     * queries, a list of possible values is returned.
     */    tn(t, e, n) {
        return this.en(t, e, n.position);
    }
    /** Returns the byte representation for the provided encoders. */    ln(t) {
        const e = [];
        for (let n = 0; n < t.length; ++n) e[n] = t[n].$e();
        return e;
    }
    /**
     * Creates a separate encoder for each element of an array.
     *
     * The method appends each value to all existing encoders (e.g. filter("a",
     * "==", "a1").filter("b", "in", ["b1", "b2"]) becomes ["a1,b1", "a1,b2"]). A
     * list of new encoders is returned.
     */    hn(t, e, n) {
        const s = [ ...t ], i = [];
        for (const t of n.arrayValue.values || []) for (const n of s) {
            const s = new vr;
            s.seed(n.$e()), pr.pe.oe(t, s.Le(e.kind)), i.push(s);
        }
        return i;
    }
    an(t, e) {
        return !!t.filters.find((t => t instanceof dn && t.field.isEqual(e) && ("in" /* Operator.IN */ === t.op || "not-in" /* Operator.NOT_IN */ === t.op)));
    }
    getFieldIndexes(t, e) {
        const n = Qr(t), s = zr(t);
        return (e ? n.j("collectionGroupIndex", IDBKeyRange.bound(e, e)) : n.j()).next((t => {
            const e = [];
            return At.forEach(t, (t => s.get([ t.indexId, this.uid ]).next((n => {
                e.push(function(t, e) {
                    const n = e ? new _t(e.sequenceNumber, new yt(or(e.readTime), new ct(Ut(e.documentKey)), e.largestBatchId)) : _t.empty(), s = t.fields.map((([t, e]) => new dt(ut.fromServerFormat(t), e)));
                    return new at(t.indexId, t.collectionGroup, s, n);
                }(t, n));
            })))).next((() => e));
        }));
    }
    getNextCollectionGroupToUpdate(t) {
        return this.getFieldIndexes(t).next((t => 0 === t.length ? null : (t.sort(((t, e) => {
            const n = t.indexState.sequenceNumber - e.indexState.sequenceNumber;
            return 0 !== n ? n : X(t.collectionGroup, e.collectionGroup);
        })), t[0].collectionGroup)));
    }
    updateCollectionGroup(t, e, n) {
        const s = Qr(t), i = zr(t);
        return this.fn(t).next((t => s.j("collectionGroupIndex", IDBKeyRange.bound(e, e)).next((e => At.forEach(e, (e => i.put(dr(e.indexId, this.user, t, n))))))));
    }
    updateIndexEntries(t, e) {
        // Porting Note: `getFieldIndexes()` on Web does not cache index lookups as
        // it could be used across different IndexedDB transactions. As any cached
        // data might be invalidated by other multi-tab clients, we can only trust
        // data within a single IndexedDB transaction. We therefore add a cache
        // here.
        const n = new Map;
        return At.forEach(e, ((e, s) => {
            const i = n.get(e.collectionGroup);
            return (i ? At.resolve(i) : this.getFieldIndexes(t, e.collectionGroup)).next((i => (n.set(e.collectionGroup, i), 
            At.forEach(i, (n => this.dn(t, e, n).next((e => {
                const i = this.wn(s, n);
                return e.isEqual(i) ? At.resolve() : this._n(t, s, n, e, i);
            })))))));
        }));
    }
    mn(t, e, n, s) {
        return Gr(t).put({
            indexId: s.indexId,
            uid: this.uid,
            arrayValue: s.arrayValue,
            directionalValue: s.directionalValue,
            orderedDocumentKey: this.cn(n, e.key),
            documentKey: e.key.path.toArray()
        });
    }
    gn(t, e, n, s) {
        return Gr(t).delete([ s.indexId, this.uid, s.arrayValue, s.directionalValue, this.cn(n, e.key), e.key.path.toArray() ]);
    }
    dn(t, e, n) {
        const s = Gr(t);
        let i = new Ie(Pr);
        return s.Z({
            index: "documentKeyIndex",
            range: IDBKeyRange.only([ n.indexId, this.uid, this.cn(n, e) ])
        }, ((t, s) => {
            i = i.add(new br(n.indexId, e, s.arrayValue, s.directionalValue));
        })).next((() => i));
    }
    /** Creates the index entries for the given document. */    wn(t, e) {
        let n = new Ie(Pr);
        const s = this.un(e, t);
        if (null == s) return n;
        const i = ht(e);
        if (null != i) {
            const r = t.data.field(i.fieldPath);
            if (je(r)) for (const i of r.arrayValue.values || []) n = n.add(new br(e.indexId, t.key, this.sn(i), s));
        } else n = n.add(new br(e.indexId, t.key, qr, s));
        return n;
    }
    /**
     * Updates the index entries for the provided document by deleting entries
     * that are no longer referenced in `newEntries` and adding all newly added
     * entries.
     */    _n(t, e, n, s, i) {
        C("IndexedDbIndexManager", "Updating index entries for document '%s'", e.key);
        const r = [];
        return function(t, e, n, s, i) {
            const r = t.getIterator(), o = e.getIterator();
            let u = Ee(r), c = Ee(o);
            // Walk through the two sets at the same time, using the ordering defined by
            // `comparator`.
            for (;u || c; ) {
                let t = !1, e = !1;
                if (u && c) {
                    const s = n(u, c);
                    s < 0 ? 
                    // The element was removed if the next element in our ordered
                    // walkthrough is only in `before`.
                    e = !0 : s > 0 && (
                    // The element was added if the next element in our ordered walkthrough
                    // is only in `after`.
                    t = !0);
                } else null != u ? e = !0 : t = !0;
                t ? (s(c), c = Ee(o)) : e ? (i(u), u = Ee(r)) : (u = Ee(r), c = Ee(o));
            }
        }(s, i, Pr, (
        /* onAdd= */ s => {
            r.push(this.mn(t, e, n, s));
        }), (
        /* onRemove= */ s => {
            r.push(this.gn(t, e, n, s));
        })), At.waitFor(r);
    }
    fn(t) {
        let e = 1;
        return zr(t).Z({
            index: "sequenceNumberIndex",
            reverse: !0,
            range: IDBKeyRange.upperBound([ this.uid, Number.MAX_SAFE_INTEGER ])
        }, ((t, n, s) => {
            s.done(), e = n.sequenceNumber + 1;
        })).next((() => e));
    }
    /**
     * Returns a new set of IDB ranges that splits the existing range and excludes
     * any values that match the `notInValue` from these ranges. As an example,
     * '[foo > 2 && foo != 3]` becomes  `[foo > 2 && < 3, foo > 3]`.
     */    createRange(t, e, n) {
        // The notIn values need to be sorted and unique so that we can return a
        // sorted set of non-overlapping ranges.
        n = n.sort(((t, e) => Pr(t, e))).filter(((t, e, n) => !e || 0 !== Pr(t, n[e - 1])));
        const s = [];
        s.push(t);
        for (const i of n) {
            const n = Pr(i, t), r = Pr(i, e);
            if (0 === n) 
            // `notInValue` is the lower bound. We therefore need to raise the bound
            // to the next value.
            s[0] = t.qe(); else if (n > 0 && r < 0) 
            // `notInValue` is in the middle of the range
            s.push(i), s.push(i.qe()); else if (r > 0) 
            // `notInValue` (and all following values) are out of the range
            break;
        }
        s.push(e);
        const i = [];
        for (let t = 0; t < s.length; t += 2) {
            // If we encounter two bounds that will create an unmatchable key range,
            // then we return an empty set of key ranges.
            if (this.yn(s[t], s[t + 1])) return [];
            const e = [ s[t].indexId, this.uid, s[t].arrayValue, s[t].directionalValue, qr, [] ], n = [ s[t + 1].indexId, this.uid, s[t + 1].arrayValue, s[t + 1].directionalValue, qr, [] ];
            i.push(IDBKeyRange.bound(e, n));
        }
        return i;
    }
    yn(t, e) {
        // If lower bound is greater than the upper bound, then the key
        // range can never be matched.
        return Pr(t, e) > 0;
    }
    getMinOffsetFromCollectionGroup(t, e) {
        return this.getFieldIndexes(t, e).next(jr);
    }
    getMinOffset(t, e) {
        return At.mapArray(this.Ze(e), (e => this.Xe(t, e).next((t => t || O())))).next(jr);
    }
}

/**
 * Helper to get a typed SimpleDbStore for the collectionParents
 * document store.
 */ function Kr(t) {
    return de(t, "collectionParents");
}

/**
 * Helper to get a typed SimpleDbStore for the index entry object store.
 */ function Gr(t) {
    return de(t, "indexEntries");
}

/**
 * Helper to get a typed SimpleDbStore for the index configuration object store.
 */ function Qr(t) {
    return de(t, "indexConfiguration");
}

/**
 * Helper to get a typed SimpleDbStore for the index state object store.
 */ function zr(t) {
    return de(t, "indexState");
}

function jr(t) {
    $(0 !== t.length);
    let e = t[0].indexState.offset, n = e.largestBatchId;
    for (let s = 1; s < t.length; s++) {
        const i = t[s].indexState.offset;
        pt(i, e) < 0 && (e = i), n < i.largestBatchId && (n = i.largestBatchId);
    }
    return new yt(e.readTime, e.documentKey, n);
}

/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Wr = {
    didRun: !1,
    sequenceNumbersCollected: 0,
    targetsRemoved: 0,
    documentsRemoved: 0
};

class Hr {
    constructor(
    // When we attempt to collect, we will only do so if the cache size is greater than this
    // threshold. Passing `COLLECTION_DISABLED` here will cause collection to always be skipped.
    t, 
    // The percentage of sequence numbers that we will attempt to collect
    e, 
    // A cap on the total number of sequence numbers that will be collected. This prevents
    // us from collecting a huge number of sequence numbers if the cache has grown very large.
    n) {
        this.cacheSizeCollectionThreshold = t, this.percentileToCollect = e, this.maximumSequenceNumbersToCollect = n;
    }
    static withCacheSize(t) {
        return new Hr(t, Hr.DEFAULT_COLLECTION_PERCENTILE, Hr.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Delete a mutation batch and the associated document mutations.
 * @returns A PersistencePromise of the document mutations that were removed.
 */
function Jr(t, e, n) {
    const s = t.store("mutations"), i = t.store("documentMutations"), r = [], o = IDBKeyRange.only(n.batchId);
    let u = 0;
    const c = s.Z({
        range: o
    }, ((t, e, n) => (u++, n.delete())));
    r.push(c.next((() => {
        $(1 === u);
    })));
    const a = [];
    for (const t of n.mutations) {
        const s = Qt(e, t.key.path, n.batchId);
        r.push(i.delete(s)), a.push(t.key);
    }
    return At.waitFor(r).next((() => a));
}

/**
 * Returns an approximate size for the given document.
 */ function Yr(t) {
    if (!t) return 0;
    let e;
    if (t.document) e = t.document; else if (t.unknownDocument) e = t.unknownDocument; else {
        if (!t.noDocument) throw O();
        e = t.noDocument;
    }
    return JSON.stringify(e).length;
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** A mutation queue for a specific user, backed by IndexedDB. */ Hr.DEFAULT_COLLECTION_PERCENTILE = 10, 
Hr.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3, Hr.DEFAULT = new Hr(41943040, Hr.DEFAULT_COLLECTION_PERCENTILE, Hr.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT), 
Hr.DISABLED = new Hr(-1, 0, 0);

class Zr {
    constructor(
    /**
     * The normalized userId (e.g. null UID => "" userId) used to store /
     * retrieve mutations.
     */
    t, e, n, s) {
        this.userId = t, this.serializer = e, this.indexManager = n, this.referenceDelegate = s, 
        /**
         * Caches the document keys for pending mutation batches. If the mutation
         * has been removed from IndexedDb, the cached value may continue to
         * be used to retrieve the batch's document keys. To remove a cached value
         * locally, `removeCachedMutationKeys()` should be invoked either directly
         * or through `removeMutationBatches()`.
         *
         * With multi-tab, when the primary client acknowledges or rejects a mutation,
         * this cache is used by secondary clients to invalidate the local
         * view of the documents that were previously affected by the mutation.
         */
        // PORTING NOTE: Multi-tab only.
        this.pn = {};
    }
    /**
     * Creates a new mutation queue for the given user.
     * @param user - The user for which to create a mutation queue.
     * @param serializer - The serializer to use when persisting to IndexedDb.
     */    static ie(t, e, n, s) {
        // TODO(mcg): Figure out what constraints there are on userIDs
        // In particular, are there any reserved characters? are empty ids allowed?
        // For the moment store these together in the same mutations table assuming
        // that empty userIDs aren't allowed.
        $("" !== t.uid);
        const i = t.isAuthenticated() ? t.uid : "";
        return new Zr(i, e, n, s);
    }
    checkEmpty(t) {
        let e = !0;
        const n = IDBKeyRange.bound([ this.userId, Number.NEGATIVE_INFINITY ], [ this.userId, Number.POSITIVE_INFINITY ]);
        return to(t).Z({
            index: "userMutationsIndex",
            range: n
        }, ((t, n, s) => {
            e = !1, s.done();
        })).next((() => e));
    }
    addMutationBatch(t, e, n, s) {
        const i = eo(t), r = to(t);
        // The IndexedDb implementation in Chrome (and Firefox) does not handle
        // compound indices that include auto-generated keys correctly. To ensure
        // that the index entry is added correctly in all browsers, we perform two
        // writes: The first write is used to retrieve the next auto-generated Batch
        // ID, and the second write populates the index and stores the actual
        // mutation batch.
        // See: https://bugs.chromium.org/p/chromium/issues/detail?id=701972
        // We write an empty object to obtain key
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return r.add({}).next((o => {
            $("number" == typeof o);
            const u = new Js(o, e, n, s), c = function(t, e, n) {
                const s = n.baseMutations.map((e => Fi(t.se, e))), i = n.mutations.map((e => Fi(t.se, e)));
                return {
                    userId: e,
                    batchId: n.batchId,
                    localWriteTimeMs: n.localWriteTime.toMillis(),
                    baseMutations: s,
                    mutations: i
                };
            }(this.serializer, this.userId, u), a = [];
            let h = new Ie(((t, e) => X(t.canonicalString(), e.canonicalString())));
            for (const t of s) {
                const e = Qt(this.userId, t.key.path, o);
                h = h.add(t.key.path.popLast()), a.push(r.put(c)), a.push(i.put(e, zt));
            }
            return h.forEach((e => {
                a.push(this.indexManager.addToCollectionParentIndex(t, e));
            })), t.addOnCommittedListener((() => {
                this.pn[o] = u.keys();
            })), At.waitFor(a).next((() => u));
        }));
    }
    lookupMutationBatch(t, e) {
        return to(t).get(e).next((t => t ? ($(t.userId === this.userId), ur(this.serializer, t)) : null));
    }
    /**
     * Returns the document keys for the mutation batch with the given batchId.
     * For primary clients, this method returns `null` after
     * `removeMutationBatches()` has been called. Secondary clients return a
     * cached result until `removeCachedMutationKeys()` is invoked.
     */
    // PORTING NOTE: Multi-tab only.
    In(t, e) {
        return this.pn[e] ? At.resolve(this.pn[e]) : this.lookupMutationBatch(t, e).next((t => {
            if (t) {
                const n = t.keys();
                return this.pn[e] = n, n;
            }
            return null;
        }));
    }
    getNextMutationBatchAfterBatchId(t, e) {
        const n = e + 1, s = IDBKeyRange.lowerBound([ this.userId, n ]);
        let i = null;
        return to(t).Z({
            index: "userMutationsIndex",
            range: s
        }, ((t, e, s) => {
            e.userId === this.userId && ($(e.batchId >= n), i = ur(this.serializer, e)), s.done();
        })).next((() => i));
    }
    getHighestUnacknowledgedBatchId(t) {
        const e = IDBKeyRange.upperBound([ this.userId, Number.POSITIVE_INFINITY ]);
        let n = -1;
        return to(t).Z({
            index: "userMutationsIndex",
            range: e,
            reverse: !0
        }, ((t, e, s) => {
            n = e.batchId, s.done();
        })).next((() => n));
    }
    getAllMutationBatches(t) {
        const e = IDBKeyRange.bound([ this.userId, -1 ], [ this.userId, Number.POSITIVE_INFINITY ]);
        return to(t).j("userMutationsIndex", e).next((t => t.map((t => ur(this.serializer, t)))));
    }
    getAllMutationBatchesAffectingDocumentKey(t, e) {
        // Scan the document-mutation index starting with a prefix starting with
        // the given documentKey.
        const n = Gt(this.userId, e.path), s = IDBKeyRange.lowerBound(n), i = [];
        return eo(t).Z({
            range: s
        }, ((n, s, r) => {
            const [o, u, c] = n, a = Ut(u);
            // Only consider rows matching exactly the specific key of
            // interest. Note that because we order by path first, and we
            // order terminators before path separators, we'll encounter all
            // the index rows for documentKey contiguously. In particular, all
            // the rows for documentKey will occur before any rows for
            // documents nested in a subcollection beneath documentKey so we
            // can stop as soon as we hit any such row.
                        if (o === this.userId && e.path.isEqual(a)) 
            // Look up the mutation batch in the store.
            return to(t).get(c).next((t => {
                if (!t) throw O();
                $(t.userId === this.userId), i.push(ur(this.serializer, t));
            }));
            r.done();
        })).next((() => i));
    }
    getAllMutationBatchesAffectingDocumentKeys(t, e) {
        let n = new Ie(X);
        const s = [];
        return e.forEach((e => {
            const i = Gt(this.userId, e.path), r = IDBKeyRange.lowerBound(i), o = eo(t).Z({
                range: r
            }, ((t, s, i) => {
                const [r, o, u] = t, c = Ut(o);
                // Only consider rows matching exactly the specific key of
                // interest. Note that because we order by path first, and we
                // order terminators before path separators, we'll encounter all
                // the index rows for documentKey contiguously. In particular, all
                // the rows for documentKey will occur before any rows for
                // documents nested in a subcollection beneath documentKey so we
                // can stop as soon as we hit any such row.
                                r === this.userId && e.path.isEqual(c) ? n = n.add(u) : i.done();
            }));
            s.push(o);
        })), At.waitFor(s).next((() => this.Tn(t, n)));
    }
    getAllMutationBatchesAffectingQuery(t, e) {
        const n = e.path, s = n.length + 1, i = Gt(this.userId, n), r = IDBKeyRange.lowerBound(i);
        // Collect up unique batchIDs encountered during a scan of the index. Use a
        // SortedSet to accumulate batch IDs so they can be traversed in order in a
        // scan of the main table.
        let o = new Ie(X);
        return eo(t).Z({
            range: r
        }, ((t, e, i) => {
            const [r, u, c] = t, a = Ut(u);
            r === this.userId && n.isPrefixOf(a) ? 
            // Rows with document keys more than one segment longer than the
            // query path can't be matches. For example, a query on 'rooms'
            // can't match the document /rooms/abc/messages/xyx.
            // TODO(mcg): we'll need a different scanner when we implement
            // ancestor queries.
            a.length === s && (o = o.add(c)) : i.done();
        })).next((() => this.Tn(t, o)));
    }
    Tn(t, e) {
        const n = [], s = [];
        // TODO(rockwood): Implement this using iterate.
        return e.forEach((e => {
            s.push(to(t).get(e).next((t => {
                if (null === t) throw O();
                $(t.userId === this.userId), n.push(ur(this.serializer, t));
            })));
        })), At.waitFor(s).next((() => n));
    }
    removeMutationBatch(t, e) {
        return Jr(t.at, this.userId, e).next((n => (t.addOnCommittedListener((() => {
            this.En(e.batchId);
        })), At.forEach(n, (e => this.referenceDelegate.markPotentiallyOrphaned(t, e))))));
    }
    /**
     * Clears the cached keys for a mutation batch. This method should be
     * called by secondary clients after they process mutation updates.
     *
     * Note that this method does not have to be called from primary clients as
     * the corresponding cache entries are cleared when an acknowledged or
     * rejected batch is removed from the mutation queue.
     */
    // PORTING NOTE: Multi-tab only
    En(t) {
        delete this.pn[t];
    }
    performConsistencyCheck(t) {
        return this.checkEmpty(t).next((e => {
            if (!e) return At.resolve();
            // Verify that there are no entries in the documentMutations index if
            // the queue is empty.
                        const n = IDBKeyRange.lowerBound([ this.userId ]);
            const s = [];
            return eo(t).Z({
                range: n
            }, ((t, e, n) => {
                if (t[0] === this.userId) {
                    const e = Ut(t[1]);
                    s.push(e);
                } else n.done();
            })).next((() => {
                $(0 === s.length);
            }));
        }));
    }
    containsKey(t, e) {
        return Xr(t, this.userId, e);
    }
    // PORTING NOTE: Multi-tab only (state is held in memory in other clients).
    /** Returns the mutation queue's metadata from IndexedDb. */
    An(t) {
        return no(t).get(this.userId).next((t => t || {
            userId: this.userId,
            lastAcknowledgedBatchId: -1,
            lastStreamToken: ""
        }));
    }
}

/**
 * @returns true if the mutation queue for the given user contains a pending
 *         mutation for the given key.
 */ function Xr(t, e, n) {
    const s = Gt(e, n.path), i = s[1], r = IDBKeyRange.lowerBound(s);
    let o = !1;
    return eo(t).Z({
        range: r,
        Y: !0
    }, ((t, n, s) => {
        const [r, u, /*batchID*/ c] = t;
        r === e && u === i && (o = !0), s.done();
    })).next((() => o));
}

/** Returns true if any mutation queue contains the given document. */
/**
 * Helper to get a typed SimpleDbStore for the mutations object store.
 */
function to(t) {
    return de(t, "mutations");
}

/**
 * Helper to get a typed SimpleDbStore for the mutationQueues object store.
 */ function eo(t) {
    return de(t, "documentMutations");
}

/**
 * Helper to get a typed SimpleDbStore for the mutationQueues object store.
 */ function no(t) {
    return de(t, "mutationQueues");
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** Offset to ensure non-overlapping target ids. */
/**
 * Generates monotonically increasing target IDs for sending targets to the
 * watch stream.
 *
 * The client constructs two generators, one for the target cache, and one for
 * for the sync engine (to generate limbo documents targets). These
 * generators produce non-overlapping IDs (by using even and odd IDs
 * respectively).
 *
 * By separating the target ID space, the query cache can generate target IDs
 * that persist across client restarts, while sync engine can independently
 * generate in-memory target IDs that are transient and can be reused after a
 * restart.
 */
class so {
    constructor(t) {
        this.Rn = t;
    }
    next() {
        return this.Rn += 2, this.Rn;
    }
    static vn() {
        // The target cache generator must return '2' in its first call to `next()`
        // as there is no differentiation in the protocol layer between an unset
        // number and the number '0'. If we were to sent a target with target ID
        // '0', the backend would consider it unset and replace it with its own ID.
        return new so(0);
    }
    static bn() {
        // Sync engine assigns target IDs for limbo document detection.
        return new so(-1);
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class io {
    constructor(t, e) {
        this.referenceDelegate = t, this.serializer = e;
    }
    // PORTING NOTE: We don't cache global metadata for the target cache, since
    // some of it (in particular `highestTargetId`) can be modified by secondary
    // tabs. We could perhaps be more granular (and e.g. still cache
    // `lastRemoteSnapshotVersion` in memory) but for simplicity we currently go
    // to IndexedDb whenever we need to read metadata. We can revisit if it turns
    // out to have a meaningful performance impact.
    allocateTargetId(t) {
        return this.Pn(t).next((e => {
            const n = new so(e.highestTargetId);
            return e.highestTargetId = n.next(), this.Vn(t, e).next((() => e.highestTargetId));
        }));
    }
    getLastRemoteSnapshotVersion(t) {
        return this.Pn(t).next((t => st.fromTimestamp(new nt(t.lastRemoteSnapshotVersion.seconds, t.lastRemoteSnapshotVersion.nanoseconds))));
    }
    getHighestSequenceNumber(t) {
        return this.Pn(t).next((t => t.highestListenSequenceNumber));
    }
    setTargetsMetadata(t, e, n) {
        return this.Pn(t).next((s => (s.highestListenSequenceNumber = e, n && (s.lastRemoteSnapshotVersion = n.toTimestamp()), 
        e > s.highestListenSequenceNumber && (s.highestListenSequenceNumber = e), this.Vn(t, s))));
    }
    addTargetData(t, e) {
        return this.Sn(t, e).next((() => this.Pn(t).next((n => (n.targetCount += 1, this.Dn(e, n), 
        this.Vn(t, n))))));
    }
    updateTargetData(t, e) {
        return this.Sn(t, e);
    }
    removeTargetData(t, e) {
        return this.removeMatchingKeysForTargetId(t, e.targetId).next((() => ro(t).delete(e.targetId))).next((() => this.Pn(t))).next((e => ($(e.targetCount > 0), 
        e.targetCount -= 1, this.Vn(t, e))));
    }
    /**
     * Drops any targets with sequence number less than or equal to the upper bound, excepting those
     * present in `activeTargetIds`. Document associations for the removed targets are also removed.
     * Returns the number of targets removed.
     */    removeTargets(t, e, n) {
        let s = 0;
        const i = [];
        return ro(t).Z(((r, o) => {
            const u = cr(o);
            u.sequenceNumber <= e && null === n.get(u.targetId) && (s++, i.push(this.removeTargetData(t, u)));
        })).next((() => At.waitFor(i))).next((() => s));
    }
    /**
     * Call provided function with each `TargetData` that we have cached.
     */    forEachTarget(t, e) {
        return ro(t).Z(((t, n) => {
            const s = cr(n);
            e(s);
        }));
    }
    Pn(t) {
        return oo(t).get("targetGlobalKey").next((t => ($(null !== t), t)));
    }
    Vn(t, e) {
        return oo(t).put("targetGlobalKey", e);
    }
    Sn(t, e) {
        return ro(t).put(ar(this.serializer, e));
    }
    /**
     * In-place updates the provided metadata to account for values in the given
     * TargetData. Saving is done separately. Returns true if there were any
     * changes to the metadata.
     */    Dn(t, e) {
        let n = !1;
        return t.targetId > e.highestTargetId && (e.highestTargetId = t.targetId, n = !0), 
        t.sequenceNumber > e.highestListenSequenceNumber && (e.highestListenSequenceNumber = t.sequenceNumber, 
        n = !0), n;
    }
    getTargetCount(t) {
        return this.Pn(t).next((t => t.targetCount));
    }
    getTargetData(t, e) {
        // Iterating by the canonicalId may yield more than one result because
        // canonicalId values are not required to be unique per target. This query
        // depends on the queryTargets index to be efficient.
        const n = Nn(e), s = IDBKeyRange.bound([ n, Number.NEGATIVE_INFINITY ], [ n, Number.POSITIVE_INFINITY ]);
        let i = null;
        return ro(t).Z({
            range: s,
            index: "queryTargetsIndex"
        }, ((t, n, s) => {
            const r = cr(n);
            // After finding a potential match, check that the target is
            // actually equal to the requested target.
                        kn(e, r.target) && (i = r, s.done());
        })).next((() => i));
    }
    addMatchingKeys(t, e, n) {
        // PORTING NOTE: The reverse index (documentsTargets) is maintained by
        // IndexedDb.
        const s = [], i = uo(t);
        return e.forEach((e => {
            const r = Bt(e.path);
            s.push(i.put({
                targetId: n,
                path: r
            })), s.push(this.referenceDelegate.addReference(t, n, e));
        })), At.waitFor(s);
    }
    removeMatchingKeys(t, e, n) {
        // PORTING NOTE: The reverse index (documentsTargets) is maintained by
        // IndexedDb.
        const s = uo(t);
        return At.forEach(e, (e => {
            const i = Bt(e.path);
            return At.waitFor([ s.delete([ n, i ]), this.referenceDelegate.removeReference(t, n, e) ]);
        }));
    }
    removeMatchingKeysForTargetId(t, e) {
        const n = uo(t), s = IDBKeyRange.bound([ e ], [ e + 1 ], 
        /*lowerOpen=*/ !1, 
        /*upperOpen=*/ !0);
        return n.delete(s);
    }
    getMatchingKeysForTargetId(t, e) {
        const n = IDBKeyRange.bound([ e ], [ e + 1 ], 
        /*lowerOpen=*/ !1, 
        /*upperOpen=*/ !0), s = uo(t);
        let i = ws();
        return s.Z({
            range: n,
            Y: !0
        }, ((t, e, n) => {
            const s = Ut(t[1]), r = new ct(s);
            i = i.add(r);
        })).next((() => i));
    }
    containsKey(t, e) {
        const n = Bt(e.path), s = IDBKeyRange.bound([ n ], [ et(n) ], 
        /*lowerOpen=*/ !1, 
        /*upperOpen=*/ !0);
        let i = 0;
        return uo(t).Z({
            index: "documentTargetsIndex",
            Y: !0,
            range: s
        }, (([t, e], n, s) => {
            // Having a sentinel row for a document does not count as containing that document;
            // For the target cache, containing the document means the document is part of some
            // target.
            0 !== t && (i++, s.done());
        })).next((() => i > 0));
    }
    /**
     * Looks up a TargetData entry by target ID.
     *
     * @param targetId - The target ID of the TargetData entry to look up.
     * @returns The cached TargetData entry, or null if the cache has no entry for
     * the target.
     */
    // PORTING NOTE: Multi-tab only.
    ne(t, e) {
        return ro(t).get(e).next((t => t ? cr(t) : null));
    }
}

/**
 * Helper to get a typed SimpleDbStore for the queries object store.
 */ function ro(t) {
    return de(t, "targets");
}

/**
 * Helper to get a typed SimpleDbStore for the target globals object store.
 */ function oo(t) {
    return de(t, "targetGlobal");
}

/**
 * Helper to get a typed SimpleDbStore for the document target object store.
 */ function uo(t) {
    return de(t, "targetDocuments");
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function co([t, e], [n, s]) {
    const i = X(t, n);
    return 0 === i ? X(e, s) : i;
}

/**
 * Used to calculate the nth sequence number. Keeps a rolling buffer of the
 * lowest n values passed to `addElement`, and finally reports the largest of
 * them in `maxValue`.
 */ class ao {
    constructor(t) {
        this.Cn = t, this.buffer = new Ie(co), this.xn = 0;
    }
    Nn() {
        return ++this.xn;
    }
    kn(t) {
        const e = [ t, this.Nn() ];
        if (this.buffer.size < this.Cn) this.buffer = this.buffer.add(e); else {
            const t = this.buffer.last();
            co(e, t) < 0 && (this.buffer = this.buffer.delete(t).add(e));
        }
    }
    get maxValue() {
        // Guaranteed to be non-empty. If we decide we are not collecting any
        // sequence numbers, nthSequenceNumber below short-circuits. If we have
        // decided that we are collecting n sequence numbers, it's because n is some
        // percentage of the existing sequence numbers. That means we should never
        // be in a situation where we are collecting sequence numbers but don't
        // actually have any.
        return this.buffer.last()[0];
    }
}

/**
 * This class is responsible for the scheduling of LRU garbage collection. It handles checking
 * whether or not GC is enabled, as well as which delay to use before the next run.
 */ class ho {
    constructor(t, e, n) {
        this.garbageCollector = t, this.asyncQueue = e, this.localStore = n, this.On = null;
    }
    start() {
        -1 !== this.garbageCollector.params.cacheSizeCollectionThreshold && this.$n(6e4);
    }
    stop() {
        this.On && (this.On.cancel(), this.On = null);
    }
    get started() {
        return null !== this.On;
    }
    $n(t) {
        C("LruGarbageCollector", `Garbage collection scheduled in ${t}ms`), this.On = this.asyncQueue.enqueueAfterDelay("lru_garbage_collection" /* TimerId.LruGarbageCollection */ , t, (async () => {
            this.On = null;
            try {
                await this.localStore.collectGarbage(this.garbageCollector);
            } catch (t) {
                Vt(t) ? C("LruGarbageCollector", "Ignoring IndexedDB error during garbage collection: ", t) : await Et(t);
            }
            await this.$n(3e5);
        }));
    }
}

/** Implements the steps for LRU garbage collection. */ class lo {
    constructor(t, e) {
        this.Mn = t, this.params = e;
    }
    calculateTargetCount(t, e) {
        return this.Mn.Fn(t).next((t => Math.floor(e / 100 * t)));
    }
    nthSequenceNumber(t, e) {
        if (0 === e) return At.resolve(Ot.ct);
        const n = new ao(e);
        return this.Mn.forEachTarget(t, (t => n.kn(t.sequenceNumber))).next((() => this.Mn.Bn(t, (t => n.kn(t))))).next((() => n.maxValue));
    }
    removeTargets(t, e, n) {
        return this.Mn.removeTargets(t, e, n);
    }
    removeOrphanedDocuments(t, e) {
        return this.Mn.removeOrphanedDocuments(t, e);
    }
    collect(t, e) {
        return -1 === this.params.cacheSizeCollectionThreshold ? (C("LruGarbageCollector", "Garbage collection skipped; disabled"), 
        At.resolve(Wr)) : this.getCacheSize(t).next((n => n < this.params.cacheSizeCollectionThreshold ? (C("LruGarbageCollector", `Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`), 
        Wr) : this.Ln(t, e)));
    }
    getCacheSize(t) {
        return this.Mn.getCacheSize(t);
    }
    Ln(t, e) {
        let n, s, i, r, o, c, a;
        const h = Date.now();
        return this.calculateTargetCount(t, this.params.percentileToCollect).next((e => (
        // Cap at the configured max
        e > this.params.maximumSequenceNumbersToCollect ? (C("LruGarbageCollector", `Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${e}`), 
        s = this.params.maximumSequenceNumbersToCollect) : s = e, r = Date.now(), this.nthSequenceNumber(t, s)))).next((s => (n = s, 
        o = Date.now(), this.removeTargets(t, n, e)))).next((e => (i = e, c = Date.now(), 
        this.removeOrphanedDocuments(t, n)))).next((t => {
            if (a = Date.now(), S() <= LogLevel.DEBUG) {
                C("LruGarbageCollector", `LRU Garbage Collection\n\tCounted targets in ${r - h}ms\n\tDetermined least recently used ${s} in ` + (o - r) + "ms\n" + `\tRemoved ${i} targets in ` + (c - o) + "ms\n" + `\tRemoved ${t} documents in ` + (a - c) + "ms\n" + `Total Duration: ${a - h}ms`);
            }
            return At.resolve({
                didRun: !0,
                sequenceNumbersCollected: s,
                targetsRemoved: i,
                documentsRemoved: t
            });
        }));
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** Provides LRU functionality for IndexedDB persistence. */
class fo {
    constructor(t, e) {
        this.db = t, this.garbageCollector = function(t, e) {
            return new lo(t, e);
        }(this, e);
    }
    Fn(t) {
        const e = this.qn(t);
        return this.db.getTargetCache().getTargetCount(t).next((t => e.next((e => t + e))));
    }
    qn(t) {
        let e = 0;
        return this.Bn(t, (t => {
            e++;
        })).next((() => e));
    }
    forEachTarget(t, e) {
        return this.db.getTargetCache().forEachTarget(t, e);
    }
    Bn(t, e) {
        return this.Un(t, ((t, n) => e(n)));
    }
    addReference(t, e, n) {
        return wo(t, n);
    }
    removeReference(t, e, n) {
        return wo(t, n);
    }
    removeTargets(t, e, n) {
        return this.db.getTargetCache().removeTargets(t, e, n);
    }
    markPotentiallyOrphaned(t, e) {
        return wo(t, e);
    }
    /**
     * Returns true if anything would prevent this document from being garbage
     * collected, given that the document in question is not present in any
     * targets and has a sequence number less than or equal to the upper bound for
     * the collection run.
     */    Kn(t, e) {
        return function(t, e) {
            let n = !1;
            return no(t).X((s => Xr(t, s, e).next((t => (t && (n = !0), At.resolve(!t)))))).next((() => n));
        }(t, e);
    }
    removeOrphanedDocuments(t, e) {
        const n = this.db.getRemoteDocumentCache().newChangeBuffer(), s = [];
        let i = 0;
        return this.Un(t, ((r, o) => {
            if (o <= e) {
                const e = this.Kn(t, r).next((e => {
                    if (!e) 
                    // Our size accounting requires us to read all documents before
                    // removing them.
                    return i++, n.getEntry(t, r).next((() => (n.removeEntry(r, st.min()), uo(t).delete([ 0, Bt(r.path) ]))));
                }));
                s.push(e);
            }
        })).next((() => At.waitFor(s))).next((() => n.apply(t))).next((() => i));
    }
    removeTarget(t, e) {
        const n = e.withSequenceNumber(t.currentSequenceNumber);
        return this.db.getTargetCache().updateTargetData(t, n);
    }
    updateLimboDocument(t, e) {
        return wo(t, e);
    }
    /**
     * Call provided function for each document in the cache that is 'orphaned'. Orphaned
     * means not a part of any target, so the only entry in the target-document index for
     * that document will be the sentinel row (targetId 0), which will also have the sequence
     * number for the last time the document was accessed.
     */    Un(t, e) {
        const n = uo(t);
        let s, i = Ot.ct;
        return n.Z({
            index: "documentTargetsIndex"
        }, (([t, n], {path: r, sequenceNumber: o}) => {
            0 === t ? (
            // if nextToReport is valid, report it, this is a new key so the
            // last one must not be a member of any targets.
            i !== Ot.ct && e(new ct(Ut(s)), i), 
            // set nextToReport to be this sequence number. It's the next one we
            // might report, if we don't find any targets for this document.
            // Note that the sequence number must be defined when the targetId
            // is 0.
            i = o, s = r) : 
            // set nextToReport to be invalid, we know we don't need to report
            // this one since we found a target for it.
            i = Ot.ct;
        })).next((() => {
            // Since we report sequence numbers after getting to the next key, we
            // need to check if the last key we iterated over was an orphaned
            // document and report it.
            i !== Ot.ct && e(new ct(Ut(s)), i);
        }));
    }
    getCacheSize(t) {
        return this.db.getRemoteDocumentCache().getSize(t);
    }
}

function wo(t, e) {
    return uo(t).put(
    /**
 * @returns A value suitable for writing a sentinel row in the target-document
 * store.
 */
    function(t, e) {
        return {
            targetId: 0,
            path: Bt(t.path),
            sequenceNumber: e
        };
    }(e, t.currentSequenceNumber));
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * An in-memory buffer of entries to be written to a RemoteDocumentCache.
 * It can be used to batch up a set of changes to be written to the cache, but
 * additionally supports reading entries back with the `getEntry()` method,
 * falling back to the underlying RemoteDocumentCache if no entry is
 * buffered.
 *
 * Entries added to the cache *must* be read first. This is to facilitate
 * calculating the size delta of the pending changes.
 *
 * PORTING NOTE: This class was implemented then removed from other platforms.
 * If byte-counting ends up being needed on the other platforms, consider
 * porting this class as part of that implementation work.
 */ class _o {
    constructor() {
        // A mapping of document key to the new cache entry that should be written.
        this.changes = new ss((t => t.toString()), ((t, e) => t.isEqual(e))), this.changesApplied = !1;
    }
    /**
     * Buffers a `RemoteDocumentCache.addEntry()` call.
     *
     * You can only modify documents that have already been retrieved via
     * `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
     */    addEntry(t) {
        this.assertNotApplied(), this.changes.set(t.key, t);
    }
    /**
     * Buffers a `RemoteDocumentCache.removeEntry()` call.
     *
     * You can only remove documents that have already been retrieved via
     * `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
     */    removeEntry(t, e) {
        this.assertNotApplied(), this.changes.set(t, on.newInvalidDocument(t).setReadTime(e));
    }
    /**
     * Looks up an entry in the cache. The buffered changes will first be checked,
     * and if no buffered change applies, this will forward to
     * `RemoteDocumentCache.getEntry()`.
     *
     * @param transaction - The transaction in which to perform any persistence
     *     operations.
     * @param documentKey - The key of the entry to look up.
     * @returns The cached document or an invalid document if we have nothing
     * cached.
     */    getEntry(t, e) {
        this.assertNotApplied();
        const n = this.changes.get(e);
        return void 0 !== n ? At.resolve(n) : this.getFromCache(t, e);
    }
    /**
     * Looks up several entries in the cache, forwarding to
     * `RemoteDocumentCache.getEntry()`.
     *
     * @param transaction - The transaction in which to perform any persistence
     *     operations.
     * @param documentKeys - The keys of the entries to look up.
     * @returns A map of cached documents, indexed by key. If an entry cannot be
     *     found, the corresponding key will be mapped to an invalid document.
     */    getEntries(t, e) {
        return this.getAllFromCache(t, e);
    }
    /**
     * Applies buffered changes to the underlying RemoteDocumentCache, using
     * the provided transaction.
     */    apply(t) {
        return this.assertNotApplied(), this.changesApplied = !0, this.applyChanges(t);
    }
    /** Helper to assert this.changes is not null  */    assertNotApplied() {}
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * The RemoteDocumentCache for IndexedDb. To construct, invoke
 * `newIndexedDbRemoteDocumentCache()`.
 */ class mo {
    constructor(t) {
        this.serializer = t;
    }
    setIndexManager(t) {
        this.indexManager = t;
    }
    /**
     * Adds the supplied entries to the cache.
     *
     * All calls of `addEntry` are required to go through the RemoteDocumentChangeBuffer
     * returned by `newChangeBuffer()` to ensure proper accounting of metadata.
     */    addEntry(t, e, n) {
        return Io(t).put(n);
    }
    /**
     * Removes a document from the cache.
     *
     * All calls of `removeEntry`  are required to go through the RemoteDocumentChangeBuffer
     * returned by `newChangeBuffer()` to ensure proper accounting of metadata.
     */    removeEntry(t, e, n) {
        return Io(t).delete(
        /**
 * Returns a key that can be used for document lookups via the primary key of
 * the DbRemoteDocument object store.
 */
        function(t, e) {
            const n = t.path.toArray();
            return [ 
            /* prefix path */ n.slice(0, n.length - 2), 
            /* collection id */ n[n.length - 2], ir(e), 
            /* document id */ n[n.length - 1] ];
        }
        /**
 * Returns a key that can be used for document lookups on the
 * `DbRemoteDocumentDocumentCollectionGroupIndex` index.
 */ (e, n));
    }
    /**
     * Updates the current cache size.
     *
     * Callers to `addEntry()` and `removeEntry()` *must* call this afterwards to update the
     * cache's metadata.
     */    updateMetadata(t, e) {
        return this.getMetadata(t).next((n => (n.byteSize += e, this.Gn(t, n))));
    }
    getEntry(t, e) {
        let n = on.newInvalidDocument(e);
        return Io(t).Z({
            index: "documentKeyIndex",
            range: IDBKeyRange.only(To(e))
        }, ((t, s) => {
            n = this.Qn(e, s);
        })).next((() => n));
    }
    /**
     * Looks up an entry in the cache.
     *
     * @param documentKey - The key of the entry to look up.
     * @returns The cached document entry and its size.
     */    zn(t, e) {
        let n = {
            size: 0,
            document: on.newInvalidDocument(e)
        };
        return Io(t).Z({
            index: "documentKeyIndex",
            range: IDBKeyRange.only(To(e))
        }, ((t, s) => {
            n = {
                document: this.Qn(e, s),
                size: Yr(s)
            };
        })).next((() => n));
    }
    getEntries(t, e) {
        let n = rs();
        return this.jn(t, e, ((t, e) => {
            const s = this.Qn(t, e);
            n = n.insert(t, s);
        })).next((() => n));
    }
    /**
     * Looks up several entries in the cache.
     *
     * @param documentKeys - The set of keys entries to look up.
     * @returns A map of documents indexed by key and a map of sizes indexed by
     *     key (zero if the document does not exist).
     */    Wn(t, e) {
        let n = rs(), s = new ge(ct.comparator);
        return this.jn(t, e, ((t, e) => {
            const i = this.Qn(t, e);
            n = n.insert(t, i), s = s.insert(t, Yr(e));
        })).next((() => ({
            documents: n,
            Hn: s
        })));
    }
    jn(t, e, n) {
        if (e.isEmpty()) return At.resolve();
        let s = new Ie(Ao);
        e.forEach((t => s = s.add(t)));
        const i = IDBKeyRange.bound(To(s.first()), To(s.last())), r = s.getIterator();
        let o = r.getNext();
        return Io(t).Z({
            index: "documentKeyIndex",
            range: i
        }, ((t, e, s) => {
            const i = ct.fromSegments([ ...e.prefixPath, e.collectionGroup, e.documentId ]);
            // Go through keys not found in cache.
                        for (;o && Ao(o, i) < 0; ) n(o, null), o = r.getNext();
            o && o.isEqual(i) && (
            // Key found in cache.
            n(o, e), o = r.hasNext() ? r.getNext() : null), 
            // Skip to the next key (if there is one).
            o ? s.G(To(o)) : s.done();
        })).next((() => {
            // The rest of the keys are not in the cache. One case where `iterate`
            // above won't go through them is when the cache is empty.
            for (;o; ) n(o, null), o = r.hasNext() ? r.getNext() : null;
        }));
    }
    getDocumentsMatchingQuery(t, e, n, s) {
        const i = e.path, r = [ i.popLast().toArray(), i.lastSegment(), ir(n.readTime), n.documentKey.path.isEmpty() ? "" : n.documentKey.path.lastSegment() ], o = [ i.popLast().toArray(), i.lastSegment(), [ Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER ], "" ];
        return Io(t).j(IDBKeyRange.bound(r, o, !0)).next((t => {
            let n = rs();
            for (const i of t) {
                const t = this.Qn(ct.fromSegments(i.prefixPath.concat(i.collectionGroup, i.documentId)), i);
                t.isFoundDocument() && (Xn(e, t) || s.has(t.key)) && (
                // Either the document matches the given query, or it is mutated.
                n = n.insert(t.key, t));
            }
            return n;
        }));
    }
    getAllFromCollectionGroup(t, e, n, s) {
        let i = rs();
        const r = Eo(e, n), o = Eo(e, yt.max());
        return Io(t).Z({
            index: "collectionGroupIndex",
            range: IDBKeyRange.bound(r, o, !0)
        }, ((t, e, n) => {
            const r = this.Qn(ct.fromSegments(e.prefixPath.concat(e.collectionGroup, e.documentId)), e);
            i = i.insert(r.key, r), i.size === s && n.done();
        })).next((() => i));
    }
    newChangeBuffer(t) {
        return new yo(this, !!t && t.trackRemovals);
    }
    getSize(t) {
        return this.getMetadata(t).next((t => t.byteSize));
    }
    getMetadata(t) {
        return po(t).get("remoteDocumentGlobalKey").next((t => ($(!!t), t)));
    }
    Gn(t, e) {
        return po(t).put("remoteDocumentGlobalKey", e);
    }
    /**
     * Decodes `dbRemoteDoc` and returns the document (or an invalid document if
     * the document corresponds to the format used for sentinel deletes).
     */    Qn(t, e) {
        if (e) {
            const t = nr(this.serializer, e);
            // Whether the document is a sentinel removal and should only be used in the
            // `getNewDocumentChanges()`
                        if (!(t.isNoDocument() && t.version.isEqual(st.min()))) return t;
        }
        return on.newInvalidDocument(t);
    }
}

/** Creates a new IndexedDbRemoteDocumentCache. */ function go(t) {
    return new mo(t);
}

/**
 * Handles the details of adding and updating documents in the IndexedDbRemoteDocumentCache.
 *
 * Unlike the MemoryRemoteDocumentChangeBuffer, the IndexedDb implementation computes the size
 * delta for all submitted changes. This avoids having to re-read all documents from IndexedDb
 * when we apply the changes.
 */ class yo extends _o {
    /**
     * @param documentCache - The IndexedDbRemoteDocumentCache to apply the changes to.
     * @param trackRemovals - Whether to create sentinel deletes that can be tracked by
     * `getNewDocumentChanges()`.
     */
    constructor(t, e) {
        super(), this.Jn = t, this.trackRemovals = e, 
        // A map of document sizes and read times prior to applying the changes in
        // this buffer.
        this.Yn = new ss((t => t.toString()), ((t, e) => t.isEqual(e)));
    }
    applyChanges(t) {
        const e = [];
        let n = 0, s = new Ie(((t, e) => X(t.canonicalString(), e.canonicalString())));
        return this.changes.forEach(((i, r) => {
            const o = this.Yn.get(i);
            if (e.push(this.Jn.removeEntry(t, i, o.readTime)), r.isValidDocument()) {
                const u = sr(this.Jn.serializer, r);
                s = s.add(i.path.popLast());
                const c = Yr(u);
                n += c - o.size, e.push(this.Jn.addEntry(t, i, u));
            } else if (n -= o.size, this.trackRemovals) {
                // In order to track removals, we store a "sentinel delete" in the
                // RemoteDocumentCache. This entry is represented by a NoDocument
                // with a version of 0 and ignored by `maybeDecodeDocument()` but
                // preserved in `getNewDocumentChanges()`.
                const n = sr(this.Jn.serializer, r.convertToNoDocument(st.min()));
                e.push(this.Jn.addEntry(t, i, n));
            }
        })), s.forEach((n => {
            e.push(this.Jn.indexManager.addToCollectionParentIndex(t, n));
        })), e.push(this.Jn.updateMetadata(t, n)), At.waitFor(e);
    }
    getFromCache(t, e) {
        // Record the size of everything we load from the cache so we can compute a delta later.
        return this.Jn.zn(t, e).next((t => (this.Yn.set(e, {
            size: t.size,
            readTime: t.document.readTime
        }), t.document)));
    }
    getAllFromCache(t, e) {
        // Record the size of everything we load from the cache so we can compute
        // a delta later.
        return this.Jn.Wn(t, e).next((({documents: t, Hn: e}) => (
        // Note: `getAllFromCache` returns two maps instead of a single map from
        // keys to `DocumentSizeEntry`s. This is to allow returning the
        // `MutableDocumentMap` directly, without a conversion.
        e.forEach(((e, n) => {
            this.Yn.set(e, {
                size: n,
                readTime: t.get(e).readTime
            });
        })), t)));
    }
}

function po(t) {
    return de(t, "remoteDocumentGlobal");
}

/**
 * Helper to get a typed SimpleDbStore for the remoteDocuments object store.
 */ function Io(t) {
    return de(t, "remoteDocumentsV14");
}

/**
 * Returns a key that can be used for document lookups on the
 * `DbRemoteDocumentDocumentKeyIndex` index.
 */ function To(t) {
    const e = t.path.toArray();
    return [ 
    /* prefix path */ e.slice(0, e.length - 2), 
    /* collection id */ e[e.length - 2], 
    /* document id */ e[e.length - 1] ];
}

function Eo(t, e) {
    const n = e.documentKey.path.toArray();
    return [ 
    /* collection id */ t, ir(e.readTime), 
    /* prefix path */ n.slice(0, n.length - 2), 
    /* document id */ n.length > 0 ? n[n.length - 1] : "" ];
}

/**
 * Comparator that compares document keys according to the primary key sorting
 * used by the `DbRemoteDocumentDocument` store (by prefix path, collection id
 * and then document ID).
 *
 * Visible for testing.
 */ function Ao(t, e) {
    const n = t.path.toArray(), s = e.path.toArray();
    // The ordering is based on https://chromium.googlesource.com/chromium/blink/+/fe5c21fef94dae71c1c3344775b8d8a7f7e6d9ec/Source/modules/indexeddb/IDBKey.cpp#74
    let i = 0;
    for (let t = 0; t < n.length - 2 && t < s.length - 2; ++t) if (i = X(n[t], s[t]), 
    i) return i;
    return i = X(n.length, s.length), i || (i = X(n[n.length - 2], s[s.length - 2]), 
    i || X(n[n.length - 1], s[s.length - 1]));
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Schema Version for the Web client:
 * 1.  Initial version including Mutation Queue, Query Cache, and Remote
 *     Document Cache
 * 2.  Used to ensure a targetGlobal object exists and add targetCount to it. No
 *     longer required because migration 3 unconditionally clears it.
 * 3.  Dropped and re-created Query Cache to deal with cache corruption related
 *     to limbo resolution. Addresses
 *     https://github.com/firebase/firebase-ios-sdk/issues/1548
 * 4.  Multi-Tab Support.
 * 5.  Removal of held write acks.
 * 6.  Create document global for tracking document cache size.
 * 7.  Ensure every cached document has a sentinel row with a sequence number.
 * 8.  Add collection-parent index for Collection Group queries.
 * 9.  Change RemoteDocumentChanges store to be keyed by readTime rather than
 *     an auto-incrementing ID. This is required for Index-Free queries.
 * 10. Rewrite the canonical IDs to the explicit Protobuf-based format.
 * 11. Add bundles and named_queries for bundle support.
 * 12. Add document overlays.
 * 13. Rewrite the keys of the remote document cache to allow for efficient
 *     document lookup via `getAll()`.
 * 14. Add overlays.
 * 15. Add indexing support.
 */
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Represents a local view (overlay) of a document, and the fields that are
 * locally mutated.
 */
class Ro {
    constructor(t, 
    /**
     * The fields that are locally mutated by patch mutations.
     *
     * If the overlayed	document is from set or delete mutations, this is `null`.
     * If there is no overlay (mutation) for the document, this is an empty `FieldMask`.
     */
    e) {
        this.overlayedDocument = t, this.mutatedFields = e;
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A readonly view of the local state of all documents we're tracking (i.e. we
 * have a cached version in remoteDocumentCache or local mutations for the
 * document). The view is computed by applying the mutations in the
 * MutationQueue to the RemoteDocumentCache.
 */ class vo {
    constructor(t, e, n, s) {
        this.remoteDocumentCache = t, this.mutationQueue = e, this.documentOverlayCache = n, 
        this.indexManager = s;
    }
    /**
     * Get the local view of the document identified by `key`.
     *
     * @returns Local view of the document or null if we don't have any cached
     * state for it.
     */    getDocument(t, e) {
        let n = null;
        return this.documentOverlayCache.getOverlay(t, e).next((s => (n = s, this.remoteDocumentCache.getEntry(t, e)))).next((t => (null !== n && Ls(n.mutation, t, Ae.empty(), nt.now()), 
        t)));
    }
    /**
     * Gets the local view of the documents identified by `keys`.
     *
     * If we don't have cached state for a document in `keys`, a NoDocument will
     * be stored for that key in the resulting set.
     */    getDocuments(t, e) {
        return this.remoteDocumentCache.getEntries(t, e).next((e => this.getLocalViewOfDocuments(t, e, ws()).next((() => e))));
    }
    /**
     * Similar to `getDocuments`, but creates the local view from the given
     * `baseDocs` without retrieving documents from the local store.
     *
     * @param transaction - The transaction this operation is scoped to.
     * @param docs - The documents to apply local mutations to get the local views.
     * @param existenceStateChanged - The set of document keys whose existence state
     *   is changed. This is useful to determine if some documents overlay needs
     *   to be recalculated.
     */    getLocalViewOfDocuments(t, e, n = ws()) {
        const s = as();
        return this.populateOverlays(t, s, e).next((() => this.computeViews(t, e, s, n).next((t => {
            let e = us();
            return t.forEach(((t, n) => {
                e = e.insert(t, n.overlayedDocument);
            })), e;
        }))));
    }
    /**
     * Gets the overlayed documents for the given document map, which will include
     * the local view of those documents and a `FieldMask` indicating which fields
     * are mutated locally, `null` if overlay is a Set or Delete mutation.
     */    getOverlayedDocuments(t, e) {
        const n = as();
        return this.populateOverlays(t, n, e).next((() => this.computeViews(t, e, n, ws())));
    }
    /**
     * Fetches the overlays for {@code docs} and adds them to provided overlay map
     * if the map does not already contain an entry for the given document key.
     */    populateOverlays(t, e, n) {
        const s = [];
        return n.forEach((t => {
            e.has(t) || s.push(t);
        })), this.documentOverlayCache.getOverlays(t, s).next((t => {
            t.forEach(((t, n) => {
                e.set(t, n);
            }));
        }));
    }
    /**
     * Computes the local view for the given documents.
     *
     * @param docs - The documents to compute views for. It also has the base
     *   version of the documents.
     * @param overlays - The overlays that need to be applied to the given base
     *   version of the documents.
     * @param existenceStateChanged - A set of documents whose existence states
     *   might have changed. This is used to determine if we need to re-calculate
     *   overlays from mutation queues.
     * @return A map represents the local documents view.
     */    computeViews(t, e, n, s) {
        let i = rs();
        const r = ls(), o = ls();
        return e.forEach(((t, e) => {
            const o = n.get(e.key);
            // Recalculate an overlay if the document's existence state changed due to
            // a remote event *and* the overlay is a PatchMutation. This is because
            // document existence state can change if some patch mutation's
            // preconditions are met.
            // NOTE: we recalculate when `overlay` is undefined as well, because there
            // might be a patch mutation whose precondition does not match before the
            // change (hence overlay is undefined), but would now match.
                        s.has(e.key) && (void 0 === o || o.mutation instanceof Gs) ? i = i.insert(e.key, e) : void 0 !== o ? (r.set(e.key, o.mutation.getFieldMask()), 
            Ls(o.mutation, e, o.mutation.getFieldMask(), nt.now())) : 
            // no overlay exists
            // Using EMPTY to indicate there is no overlay for the document.
            r.set(e.key, Ae.empty());
        })), this.recalculateAndSaveOverlays(t, i).next((t => (t.forEach(((t, e) => r.set(t, e))), 
        e.forEach(((t, e) => {
            var n;
            return o.set(t, new Ro(e, null !== (n = r.get(t)) && void 0 !== n ? n : null));
        })), o)));
    }
    recalculateAndSaveOverlays(t, e) {
        const n = ls();
        // A reverse lookup map from batch id to the documents within that batch.
                let s = new ge(((t, e) => t - e)), i = ws();
        return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(t, e).next((t => {
            for (const i of t) i.keys().forEach((t => {
                const r = e.get(t);
                if (null === r) return;
                let o = n.get(t) || Ae.empty();
                o = i.applyToLocalView(r, o), n.set(t, o);
                const u = (s.get(i.batchId) || ws()).add(t);
                s = s.insert(i.batchId, u);
            }));
        })).next((() => {
            const r = [], o = s.getReverseIterator();
            // Iterate in descending order of batch IDs, and skip documents that are
            // already saved.
                        for (;o.hasNext(); ) {
                const s = o.getNext(), u = s.key, c = s.value, a = hs();
                c.forEach((t => {
                    if (!i.has(t)) {
                        const s = Fs(e.get(t), n.get(t));
                        null !== s && a.set(t, s), i = i.add(t);
                    }
                })), r.push(this.documentOverlayCache.saveOverlays(t, u, a));
            }
            return At.waitFor(r);
        })).next((() => n));
    }
    /**
     * Recalculates overlays by reading the documents from remote document cache
     * first, and saves them after they are calculated.
     */    recalculateAndSaveOverlaysForDocumentKeys(t, e) {
        return this.remoteDocumentCache.getEntries(t, e).next((e => this.recalculateAndSaveOverlays(t, e)));
    }
    /**
     * Performs a query against the local view of all documents.
     *
     * @param transaction - The persistence transaction.
     * @param query - The query to match documents against.
     * @param offset - Read time and key to start scanning by (exclusive).
     */    getDocumentsMatchingQuery(t, e, n) {
        /**
 * Returns whether the query matches a single document by path (rather than a
 * collection).
 */
        return function(t) {
            return ct.isDocumentKey(t.path) && null === t.collectionGroup && 0 === t.filters.length;
        }(e) ? this.getDocumentsMatchingDocumentQuery(t, e.path) : Qn(e) ? this.getDocumentsMatchingCollectionGroupQuery(t, e, n) : this.getDocumentsMatchingCollectionQuery(t, e, n);
    }
    /**
     * Given a collection group, returns the next documents that follow the provided offset, along
     * with an updated batch ID.
     *
     * <p>The documents returned by this method are ordered by remote version from the provided
     * offset. If there are no more remote documents after the provided offset, documents with
     * mutations in order of batch id from the offset are returned. Since all documents in a batch are
     * returned together, the total number of documents returned can exceed {@code count}.
     *
     * @param transaction
     * @param collectionGroup The collection group for the documents.
     * @param offset The offset to index into.
     * @param count The number of documents to return
     * @return A LocalWriteResult with the documents that follow the provided offset and the last processed batch id.
     */    getNextDocuments(t, e, n, s) {
        return this.remoteDocumentCache.getAllFromCollectionGroup(t, e, n, s).next((i => {
            const r = s - i.size > 0 ? this.documentOverlayCache.getOverlaysForCollectionGroup(t, e, n.largestBatchId, s - i.size) : At.resolve(as());
            // The callsite will use the largest batch ID together with the latest read time to create
            // a new index offset. Since we only process batch IDs if all remote documents have been read,
            // no overlay will increase the overall read time. This is why we only need to special case
            // the batch id.
                        let o = -1, u = i;
            return r.next((e => At.forEach(e, ((e, n) => (o < n.largestBatchId && (o = n.largestBatchId), 
            i.get(e) ? At.resolve() : this.remoteDocumentCache.getEntry(t, e).next((t => {
                u = u.insert(e, t);
            }))))).next((() => this.populateOverlays(t, e, i))).next((() => this.computeViews(t, u, e, ws()))).next((t => ({
                batchId: o,
                changes: cs(t)
            })))));
        }));
    }
    getDocumentsMatchingDocumentQuery(t, e) {
        // Just do a simple document lookup.
        return this.getDocument(t, new ct(e)).next((t => {
            let e = us();
            return t.isFoundDocument() && (e = e.insert(t.key, t)), e;
        }));
    }
    getDocumentsMatchingCollectionGroupQuery(t, e, n) {
        const s = e.collectionGroup;
        let i = us();
        return this.indexManager.getCollectionParents(t, s).next((r => At.forEach(r, (r => {
            const o = function(t, e) {
                return new Bn(e, 
                /*collectionGroup=*/ null, t.explicitOrderBy.slice(), t.filters.slice(), t.limit, t.limitType, t.startAt, t.endAt);
            }(e, r.child(s));
            return this.getDocumentsMatchingCollectionQuery(t, o, n).next((t => {
                t.forEach(((t, e) => {
                    i = i.insert(t, e);
                }));
            }));
        })).next((() => i))));
    }
    getDocumentsMatchingCollectionQuery(t, e, n) {
        // Query the remote documents and overlay mutations.
        let s;
        return this.documentOverlayCache.getOverlaysForCollection(t, e.path, n.largestBatchId).next((i => (s = i, 
        this.remoteDocumentCache.getDocumentsMatchingQuery(t, e, n, s)))).next((t => {
            // As documents might match the query because of their overlay we need to
            // include documents for all overlays in the initial document set.
            s.forEach(((e, n) => {
                const s = n.getKey();
                null === t.get(s) && (t = t.insert(s, on.newInvalidDocument(s)));
            }));
            // Apply the overlays and match against the query.
            let n = us();
            return t.forEach(((t, i) => {
                const r = s.get(t);
                void 0 !== r && Ls(r.mutation, i, Ae.empty(), nt.now()), 
                // Finally, insert the documents that still match the query
                Xn(e, i) && (n = n.insert(t, i));
            })), n;
        }));
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class bo {
    constructor(t) {
        this.serializer = t, this.Zn = new Map, this.Xn = new Map;
    }
    getBundleMetadata(t, e) {
        return At.resolve(this.Zn.get(e));
    }
    saveBundleMetadata(t, e) {
        /** Decodes a BundleMetadata proto into a BundleMetadata object. */
        var n;
        return this.Zn.set(e.id, {
            id: (n = e).id,
            version: n.version,
            createTime: vi(n.createTime)
        }), At.resolve();
    }
    getNamedQuery(t, e) {
        return At.resolve(this.Xn.get(e));
    }
    saveNamedQuery(t, e) {
        return this.Xn.set(e.name, function(t) {
            return {
                name: t.name,
                query: hr(t.bundledQuery),
                readTime: vi(t.readTime)
            };
        }(e)), At.resolve();
    }
}

/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * An in-memory implementation of DocumentOverlayCache.
 */ class Po {
    constructor() {
        // A map sorted by DocumentKey, whose value is a pair of the largest batch id
        // for the overlay and the overlay itself.
        this.overlays = new ge(ct.comparator), this.ts = new Map;
    }
    getOverlay(t, e) {
        return At.resolve(this.overlays.get(e));
    }
    getOverlays(t, e) {
        const n = as();
        return At.forEach(e, (e => this.getOverlay(t, e).next((t => {
            null !== t && n.set(e, t);
        })))).next((() => n));
    }
    saveOverlays(t, e, n) {
        return n.forEach(((n, s) => {
            this.re(t, e, s);
        })), At.resolve();
    }
    removeOverlaysForBatchId(t, e, n) {
        const s = this.ts.get(n);
        return void 0 !== s && (s.forEach((t => this.overlays = this.overlays.remove(t))), 
        this.ts.delete(n)), At.resolve();
    }
    getOverlaysForCollection(t, e, n) {
        const s = as(), i = e.length + 1, r = new ct(e.child("")), o = this.overlays.getIteratorFrom(r);
        for (;o.hasNext(); ) {
            const t = o.getNext().value, r = t.getKey();
            if (!e.isPrefixOf(r.path)) break;
            // Documents from sub-collections
                        r.path.length === i && (t.largestBatchId > n && s.set(t.getKey(), t));
        }
        return At.resolve(s);
    }
    getOverlaysForCollectionGroup(t, e, n, s) {
        let i = new ge(((t, e) => t - e));
        const r = this.overlays.getIterator();
        for (;r.hasNext(); ) {
            const t = r.getNext().value;
            if (t.getKey().getCollectionGroup() === e && t.largestBatchId > n) {
                let e = i.get(t.largestBatchId);
                null === e && (e = as(), i = i.insert(t.largestBatchId, e)), e.set(t.getKey(), t);
            }
        }
        const o = as(), u = i.getIterator();
        for (;u.hasNext(); ) {
            if (u.getNext().value.forEach(((t, e) => o.set(t, e))), o.size() >= s) break;
        }
        return At.resolve(o);
    }
    re(t, e, n) {
        // Remove the association of the overlay to its batch id.
        const s = this.overlays.get(n.key);
        if (null !== s) {
            const t = this.ts.get(s.largestBatchId).delete(n.key);
            this.ts.set(s.largestBatchId, t);
        }
        this.overlays = this.overlays.insert(n.key, new Zs(e, n));
        // Create the association of this overlay to the given largestBatchId.
        let i = this.ts.get(e);
        void 0 === i && (i = ws(), this.ts.set(e, i)), this.ts.set(e, i.add(n.key));
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A collection of references to a document from some kind of numbered entity
 * (either a target ID or batch ID). As references are added to or removed from
 * the set corresponding events are emitted to a registered garbage collector.
 *
 * Each reference is represented by a DocumentReference object. Each of them
 * contains enough information to uniquely identify the reference. They are all
 * stored primarily in a set sorted by key. A document is considered garbage if
 * there's no references in that set (this can be efficiently checked thanks to
 * sorting by key).
 *
 * ReferenceSet also keeps a secondary set that contains references sorted by
 * IDs. This one is used to efficiently implement removal of all references by
 * some target ID.
 */ class Vo {
    constructor() {
        // A set of outstanding references to a document sorted by key.
        this.es = new Ie(So.ns), 
        // A set of outstanding references to a document sorted by target id.
        this.ss = new Ie(So.rs);
    }
    /** Returns true if the reference set contains no references. */    isEmpty() {
        return this.es.isEmpty();
    }
    /** Adds a reference to the given document key for the given ID. */    addReference(t, e) {
        const n = new So(t, e);
        this.es = this.es.add(n), this.ss = this.ss.add(n);
    }
    /** Add references to the given document keys for the given ID. */    os(t, e) {
        t.forEach((t => this.addReference(t, e)));
    }
    /**
     * Removes a reference to the given document key for the given
     * ID.
     */    removeReference(t, e) {
        this.us(new So(t, e));
    }
    cs(t, e) {
        t.forEach((t => this.removeReference(t, e)));
    }
    /**
     * Clears all references with a given ID. Calls removeRef() for each key
     * removed.
     */    hs(t) {
        const e = new ct(new rt([])), n = new So(e, t), s = new So(e, t + 1), i = [];
        return this.ss.forEachInRange([ n, s ], (t => {
            this.us(t), i.push(t.key);
        })), i;
    }
    ls() {
        this.es.forEach((t => this.us(t)));
    }
    us(t) {
        this.es = this.es.delete(t), this.ss = this.ss.delete(t);
    }
    fs(t) {
        const e = new ct(new rt([])), n = new So(e, t), s = new So(e, t + 1);
        let i = ws();
        return this.ss.forEachInRange([ n, s ], (t => {
            i = i.add(t.key);
        })), i;
    }
    containsKey(t) {
        const e = new So(t, 0), n = this.es.firstAfterOrEqual(e);
        return null !== n && t.isEqual(n.key);
    }
}

class So {
    constructor(t, e) {
        this.key = t, this.ds = e;
    }
    /** Compare by key then by ID */    static ns(t, e) {
        return ct.comparator(t.key, e.key) || X(t.ds, e.ds);
    }
    /** Compare by ID then by key */    static rs(t, e) {
        return X(t.ds, e.ds) || ct.comparator(t.key, e.key);
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Do {
    constructor(t, e) {
        this.indexManager = t, this.referenceDelegate = e, 
        /**
         * The set of all mutations that have been sent but not yet been applied to
         * the backend.
         */
        this.mutationQueue = [], 
        /** Next value to use when assigning sequential IDs to each mutation batch. */
        this.ws = 1, 
        /** An ordered mapping between documents and the mutations batch IDs. */
        this._s = new Ie(So.ns);
    }
    checkEmpty(t) {
        return At.resolve(0 === this.mutationQueue.length);
    }
    addMutationBatch(t, e, n, s) {
        const i = this.ws;
        this.ws++, this.mutationQueue.length > 0 && this.mutationQueue[this.mutationQueue.length - 1];
        const r = new Js(i, e, n, s);
        this.mutationQueue.push(r);
        // Track references by document key and index collection parents.
        for (const e of s) this._s = this._s.add(new So(e.key, i)), this.indexManager.addToCollectionParentIndex(t, e.key.path.popLast());
        return At.resolve(r);
    }
    lookupMutationBatch(t, e) {
        return At.resolve(this.gs(e));
    }
    getNextMutationBatchAfterBatchId(t, e) {
        const n = e + 1, s = this.ys(n), i = s < 0 ? 0 : s;
        // The requested batchId may still be out of range so normalize it to the
        // start of the queue.
                return At.resolve(this.mutationQueue.length > i ? this.mutationQueue[i] : null);
    }
    getHighestUnacknowledgedBatchId() {
        return At.resolve(0 === this.mutationQueue.length ? -1 : this.ws - 1);
    }
    getAllMutationBatches(t) {
        return At.resolve(this.mutationQueue.slice());
    }
    getAllMutationBatchesAffectingDocumentKey(t, e) {
        const n = new So(e, 0), s = new So(e, Number.POSITIVE_INFINITY), i = [];
        return this._s.forEachInRange([ n, s ], (t => {
            const e = this.gs(t.ds);
            i.push(e);
        })), At.resolve(i);
    }
    getAllMutationBatchesAffectingDocumentKeys(t, e) {
        let n = new Ie(X);
        return e.forEach((t => {
            const e = new So(t, 0), s = new So(t, Number.POSITIVE_INFINITY);
            this._s.forEachInRange([ e, s ], (t => {
                n = n.add(t.ds);
            }));
        })), At.resolve(this.ps(n));
    }
    getAllMutationBatchesAffectingQuery(t, e) {
        // Use the query path as a prefix for testing if a document matches the
        // query.
        const n = e.path, s = n.length + 1;
        // Construct a document reference for actually scanning the index. Unlike
        // the prefix the document key in this reference must have an even number of
        // segments. The empty segment can be used a suffix of the query path
        // because it precedes all other segments in an ordered traversal.
        let i = n;
        ct.isDocumentKey(i) || (i = i.child(""));
        const r = new So(new ct(i), 0);
        // Find unique batchIDs referenced by all documents potentially matching the
        // query.
                let o = new Ie(X);
        return this._s.forEachWhile((t => {
            const e = t.key.path;
            return !!n.isPrefixOf(e) && (
            // Rows with document keys more than one segment longer than the query
            // path can't be matches. For example, a query on 'rooms' can't match
            // the document /rooms/abc/messages/xyx.
            // TODO(mcg): we'll need a different scanner when we implement
            // ancestor queries.
            e.length === s && (o = o.add(t.ds)), !0);
        }), r), At.resolve(this.ps(o));
    }
    ps(t) {
        // Construct an array of matching batches, sorted by batchID to ensure that
        // multiple mutations affecting the same document key are applied in order.
        const e = [];
        return t.forEach((t => {
            const n = this.gs(t);
            null !== n && e.push(n);
        })), e;
    }
    removeMutationBatch(t, e) {
        $(0 === this.Is(e.batchId, "removed")), this.mutationQueue.shift();
        let n = this._s;
        return At.forEach(e.mutations, (s => {
            const i = new So(s.key, e.batchId);
            return n = n.delete(i), this.referenceDelegate.markPotentiallyOrphaned(t, s.key);
        })).next((() => {
            this._s = n;
        }));
    }
    En(t) {
        // No-op since the memory mutation queue does not maintain a separate cache.
    }
    containsKey(t, e) {
        const n = new So(e, 0), s = this._s.firstAfterOrEqual(n);
        return At.resolve(e.isEqual(s && s.key));
    }
    performConsistencyCheck(t) {
        return this.mutationQueue.length, At.resolve();
    }
    /**
     * Finds the index of the given batchId in the mutation queue and asserts that
     * the resulting index is within the bounds of the queue.
     *
     * @param batchId - The batchId to search for
     * @param action - A description of what the caller is doing, phrased in passive
     * form (e.g. "acknowledged" in a routine that acknowledges batches).
     */    Is(t, e) {
        return this.ys(t);
    }
    /**
     * Finds the index of the given batchId in the mutation queue. This operation
     * is O(1).
     *
     * @returns The computed index of the batch with the given batchId, based on
     * the state of the queue. Note this index can be negative if the requested
     * batchId has already been remvoed from the queue or past the end of the
     * queue if the batchId is larger than the last added batch.
     */    ys(t) {
        if (0 === this.mutationQueue.length) 
        // As an index this is past the end of the queue
        return 0;
        // Examine the front of the queue to figure out the difference between the
        // batchId and indexes in the array. Note that since the queue is ordered
        // by batchId, if the first batch has a larger batchId then the requested
        // batchId doesn't exist in the queue.
                return t - this.mutationQueue[0].batchId;
    }
    /**
     * A version of lookupMutationBatch that doesn't return a promise, this makes
     * other functions that uses this code easier to read and more efficent.
     */    gs(t) {
        const e = this.ys(t);
        if (e < 0 || e >= this.mutationQueue.length) return null;
        return this.mutationQueue[e];
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * The memory-only RemoteDocumentCache for IndexedDb. To construct, invoke
 * `newMemoryRemoteDocumentCache()`.
 */
class Co {
    /**
     * @param sizer - Used to assess the size of a document. For eager GC, this is
     * expected to just return 0 to avoid unnecessarily doing the work of
     * calculating the size.
     */
    constructor(t) {
        this.Ts = t, 
        /** Underlying cache of documents and their read times. */
        this.docs = new ge(ct.comparator), 
        /** Size of all cached documents. */
        this.size = 0;
    }
    setIndexManager(t) {
        this.indexManager = t;
    }
    /**
     * Adds the supplied entry to the cache and updates the cache size as appropriate.
     *
     * All calls of `addEntry`  are required to go through the RemoteDocumentChangeBuffer
     * returned by `newChangeBuffer()`.
     */    addEntry(t, e) {
        const n = e.key, s = this.docs.get(n), i = s ? s.size : 0, r = this.Ts(e);
        return this.docs = this.docs.insert(n, {
            document: e.mutableCopy(),
            size: r
        }), this.size += r - i, this.indexManager.addToCollectionParentIndex(t, n.path.popLast());
    }
    /**
     * Removes the specified entry from the cache and updates the cache size as appropriate.
     *
     * All calls of `removeEntry` are required to go through the RemoteDocumentChangeBuffer
     * returned by `newChangeBuffer()`.
     */    removeEntry(t) {
        const e = this.docs.get(t);
        e && (this.docs = this.docs.remove(t), this.size -= e.size);
    }
    getEntry(t, e) {
        const n = this.docs.get(e);
        return At.resolve(n ? n.document.mutableCopy() : on.newInvalidDocument(e));
    }
    getEntries(t, e) {
        let n = rs();
        return e.forEach((t => {
            const e = this.docs.get(t);
            n = n.insert(t, e ? e.document.mutableCopy() : on.newInvalidDocument(t));
        })), At.resolve(n);
    }
    getDocumentsMatchingQuery(t, e, n, s) {
        let i = rs();
        // Documents are ordered by key, so we can use a prefix scan to narrow down
        // the documents we need to match the query against.
                const r = e.path, o = new ct(r.child("")), u = this.docs.getIteratorFrom(o);
        for (;u.hasNext(); ) {
            const {key: t, value: {document: o}} = u.getNext();
            if (!r.isPrefixOf(t.path)) break;
            t.path.length > r.length + 1 || (pt(gt(o), n) <= 0 || (s.has(o.key) || Xn(e, o)) && (i = i.insert(o.key, o.mutableCopy())));
        }
        return At.resolve(i);
    }
    getAllFromCollectionGroup(t, e, n, s) {
        // This method should only be called from the IndexBackfiller if persistence
        // is enabled.
        O();
    }
    Es(t, e) {
        return At.forEach(this.docs, (t => e(t)));
    }
    newChangeBuffer(t) {
        // `trackRemovals` is ignores since the MemoryRemoteDocumentCache keeps
        // a separate changelog and does not need special handling for removals.
        return new xo(this);
    }
    getSize(t) {
        return At.resolve(this.size);
    }
}

/**
 * Creates a new memory-only RemoteDocumentCache.
 *
 * @param sizer - Used to assess the size of a document. For eager GC, this is
 * expected to just return 0 to avoid unnecessarily doing the work of
 * calculating the size.
 */
/**
 * Handles the details of adding and updating documents in the MemoryRemoteDocumentCache.
 */
class xo extends _o {
    constructor(t) {
        super(), this.Jn = t;
    }
    applyChanges(t) {
        const e = [];
        return this.changes.forEach(((n, s) => {
            s.isValidDocument() ? e.push(this.Jn.addEntry(t, s)) : this.Jn.removeEntry(n);
        })), At.waitFor(e);
    }
    getFromCache(t, e) {
        return this.Jn.getEntry(t, e);
    }
    getAllFromCache(t, e) {
        return this.Jn.getEntries(t, e);
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class No {
    constructor(t) {
        this.persistence = t, 
        /**
         * Maps a target to the data about that target
         */
        this.As = new ss((t => Nn(t)), kn), 
        /** The last received snapshot version. */
        this.lastRemoteSnapshotVersion = st.min(), 
        /** The highest numbered target ID encountered. */
        this.highestTargetId = 0, 
        /** The highest sequence number encountered. */
        this.Rs = 0, 
        /**
         * A ordered bidirectional mapping between documents and the remote target
         * IDs.
         */
        this.vs = new Vo, this.targetCount = 0, this.bs = so.vn();
    }
    forEachTarget(t, e) {
        return this.As.forEach(((t, n) => e(n))), At.resolve();
    }
    getLastRemoteSnapshotVersion(t) {
        return At.resolve(this.lastRemoteSnapshotVersion);
    }
    getHighestSequenceNumber(t) {
        return At.resolve(this.Rs);
    }
    allocateTargetId(t) {
        return this.highestTargetId = this.bs.next(), At.resolve(this.highestTargetId);
    }
    setTargetsMetadata(t, e, n) {
        return n && (this.lastRemoteSnapshotVersion = n), e > this.Rs && (this.Rs = e), 
        At.resolve();
    }
    Sn(t) {
        this.As.set(t.target, t);
        const e = t.targetId;
        e > this.highestTargetId && (this.bs = new so(e), this.highestTargetId = e), t.sequenceNumber > this.Rs && (this.Rs = t.sequenceNumber);
    }
    addTargetData(t, e) {
        return this.Sn(e), this.targetCount += 1, At.resolve();
    }
    updateTargetData(t, e) {
        return this.Sn(e), At.resolve();
    }
    removeTargetData(t, e) {
        return this.As.delete(e.target), this.vs.hs(e.targetId), this.targetCount -= 1, 
        At.resolve();
    }
    removeTargets(t, e, n) {
        let s = 0;
        const i = [];
        return this.As.forEach(((r, o) => {
            o.sequenceNumber <= e && null === n.get(o.targetId) && (this.As.delete(r), i.push(this.removeMatchingKeysForTargetId(t, o.targetId)), 
            s++);
        })), At.waitFor(i).next((() => s));
    }
    getTargetCount(t) {
        return At.resolve(this.targetCount);
    }
    getTargetData(t, e) {
        const n = this.As.get(e) || null;
        return At.resolve(n);
    }
    addMatchingKeys(t, e, n) {
        return this.vs.os(e, n), At.resolve();
    }
    removeMatchingKeys(t, e, n) {
        this.vs.cs(e, n);
        const s = this.persistence.referenceDelegate, i = [];
        return s && e.forEach((e => {
            i.push(s.markPotentiallyOrphaned(t, e));
        })), At.waitFor(i);
    }
    removeMatchingKeysForTargetId(t, e) {
        return this.vs.hs(e), At.resolve();
    }
    getMatchingKeysForTargetId(t, e) {
        const n = this.vs.fs(e);
        return At.resolve(n);
    }
    containsKey(t, e) {
        return At.resolve(this.vs.containsKey(e));
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A memory-backed instance of Persistence. Data is stored only in RAM and
 * not persisted across sessions.
 */
class ko {
    /**
     * The constructor accepts a factory for creating a reference delegate. This
     * allows both the delegate and this instance to have strong references to
     * each other without having nullable fields that would then need to be
     * checked or asserted on every access.
     */
    constructor(t, e) {
        this.Ps = {}, this.overlays = {}, this.Vs = new Ot(0), this.Ss = !1, this.Ss = !0, 
        this.referenceDelegate = t(this), this.Ds = new No(this);
        this.indexManager = new Br, this.remoteDocumentCache = function(t) {
            return new Co(t);
        }((t => this.referenceDelegate.Cs(t))), this.serializer = new er(e), this.xs = new bo(this.serializer);
    }
    start() {
        return Promise.resolve();
    }
    shutdown() {
        // No durable state to ensure is closed on shutdown.
        return this.Ss = !1, Promise.resolve();
    }
    get started() {
        return this.Ss;
    }
    setDatabaseDeletedListener() {
        // No op.
    }
    setNetworkEnabled() {
        // No op.
    }
    getIndexManager(t) {
        // We do not currently support indices for memory persistence, so we can
        // return the same shared instance of the memory index manager.
        return this.indexManager;
    }
    getDocumentOverlayCache(t) {
        let e = this.overlays[t.toKey()];
        return e || (e = new Po, this.overlays[t.toKey()] = e), e;
    }
    getMutationQueue(t, e) {
        let n = this.Ps[t.toKey()];
        return n || (n = new Do(e, this.referenceDelegate), this.Ps[t.toKey()] = n), n;
    }
    getTargetCache() {
        return this.Ds;
    }
    getRemoteDocumentCache() {
        return this.remoteDocumentCache;
    }
    getBundleCache() {
        return this.xs;
    }
    runTransaction(t, e, n) {
        C("MemoryPersistence", "Starting transaction:", t);
        const s = new Oo(this.Vs.next());
        return this.referenceDelegate.Ns(), n(s).next((t => this.referenceDelegate.ks(s).next((() => t)))).toPromise().then((t => (s.raiseOnCommittedEvent(), 
        t)));
    }
    Os(t, e) {
        return At.or(Object.values(this.Ps).map((n => () => n.containsKey(t, e))));
    }
}

/**
 * Memory persistence is not actually transactional, but future implementations
 * may have transaction-scoped state.
 */ class Oo extends Tt {
    constructor(t) {
        super(), this.currentSequenceNumber = t;
    }
}

class $o {
    constructor(t) {
        this.persistence = t, 
        /** Tracks all documents that are active in Query views. */
        this.$s = new Vo, 
        /** The list of documents that are potentially GCed after each transaction. */
        this.Ms = null;
    }
    static Fs(t) {
        return new $o(t);
    }
    get Bs() {
        if (this.Ms) return this.Ms;
        throw O();
    }
    addReference(t, e, n) {
        return this.$s.addReference(n, e), this.Bs.delete(n.toString()), At.resolve();
    }
    removeReference(t, e, n) {
        return this.$s.removeReference(n, e), this.Bs.add(n.toString()), At.resolve();
    }
    markPotentiallyOrphaned(t, e) {
        return this.Bs.add(e.toString()), At.resolve();
    }
    removeTarget(t, e) {
        this.$s.hs(e.targetId).forEach((t => this.Bs.add(t.toString())));
        const n = this.persistence.getTargetCache();
        return n.getMatchingKeysForTargetId(t, e.targetId).next((t => {
            t.forEach((t => this.Bs.add(t.toString())));
        })).next((() => n.removeTargetData(t, e)));
    }
    Ns() {
        this.Ms = new Set;
    }
    ks(t) {
        // Remove newly orphaned documents.
        const e = this.persistence.getRemoteDocumentCache().newChangeBuffer();
        return At.forEach(this.Bs, (n => {
            const s = ct.fromPath(n);
            return this.Ls(t, s).next((t => {
                t || e.removeEntry(s, st.min());
            }));
        })).next((() => (this.Ms = null, e.apply(t))));
    }
    updateLimboDocument(t, e) {
        return this.Ls(t, e).next((t => {
            t ? this.Bs.delete(e.toString()) : this.Bs.add(e.toString());
        }));
    }
    Cs(t) {
        // For eager GC, we don't care about the document size, there are no size thresholds.
        return 0;
    }
    Ls(t, e) {
        return At.or([ () => At.resolve(this.$s.containsKey(e)), () => this.persistence.getTargetCache().containsKey(t, e), () => this.persistence.Os(t, e) ]);
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** Performs database creation and schema upgrades. */ class Mo {
    constructor(t) {
        this.serializer = t;
    }
    /**
     * Performs database creation and schema upgrades.
     *
     * Note that in production, this method is only ever used to upgrade the schema
     * to SCHEMA_VERSION. Different values of toVersion are only used for testing
     * and local feature development.
     */    M(t, e, n, s) {
        const i = new Rt("createOrUpgrade", e);
        n < 1 && s >= 1 && (function(t) {
            t.createObjectStore("owner");
        }(t), function(t) {
            t.createObjectStore("mutationQueues", {
                keyPath: "userId"
            });
            t.createObjectStore("mutations", {
                keyPath: "batchId",
                autoIncrement: !0
            }).createIndex("userMutationsIndex", Kt, {
                unique: !0
            }), t.createObjectStore("documentMutations");
        }
        /**
 * Upgrade function to migrate the 'mutations' store from V1 to V3. Loads
 * and rewrites all data.
 */ (t), Fo(t), function(t) {
            t.createObjectStore("remoteDocuments");
        }(t));
        // Migration 2 to populate the targetGlobal object no longer needed since
        // migration 3 unconditionally clears it.
                let r = At.resolve();
        return n < 3 && s >= 3 && (
        // Brand new clients don't need to drop and recreate--only clients that
        // potentially have corrupt data.
        0 !== n && (!function(t) {
            t.deleteObjectStore("targetDocuments"), t.deleteObjectStore("targets"), t.deleteObjectStore("targetGlobal");
        }(t), Fo(t)), r = r.next((() => 
        /**
 * Creates the target global singleton row.
 *
 * @param txn - The version upgrade transaction for indexeddb
 */
        function(t) {
            const e = t.store("targetGlobal"), n = {
                highestTargetId: 0,
                highestListenSequenceNumber: 0,
                lastRemoteSnapshotVersion: st.min().toTimestamp(),
                targetCount: 0
            };
            return e.put("targetGlobalKey", n);
        }(i)))), n < 4 && s >= 4 && (0 !== n && (
        // Schema version 3 uses auto-generated keys to generate globally unique
        // mutation batch IDs (this was previously ensured internally by the
        // client). To migrate to the new schema, we have to read all mutations
        // and write them back out. We preserve the existing batch IDs to guarantee
        // consistency with other object stores. Any further mutation batch IDs will
        // be auto-generated.
        r = r.next((() => function(t, e) {
            return e.store("mutations").j().next((n => {
                t.deleteObjectStore("mutations");
                t.createObjectStore("mutations", {
                    keyPath: "batchId",
                    autoIncrement: !0
                }).createIndex("userMutationsIndex", Kt, {
                    unique: !0
                });
                const s = e.store("mutations"), i = n.map((t => s.put(t)));
                return At.waitFor(i);
            }));
        }(t, i)))), r = r.next((() => {
            !function(t) {
                t.createObjectStore("clientMetadata", {
                    keyPath: "clientId"
                });
            }(t);
        }))), n < 5 && s >= 5 && (r = r.next((() => this.qs(i)))), n < 6 && s >= 6 && (r = r.next((() => (function(t) {
            t.createObjectStore("remoteDocumentGlobal");
        }(t), this.Us(i))))), n < 7 && s >= 7 && (r = r.next((() => this.Ks(i)))), n < 8 && s >= 8 && (r = r.next((() => this.Gs(t, i)))), 
        n < 9 && s >= 9 && (r = r.next((() => {
            // Multi-Tab used to manage its own changelog, but this has been moved
            // to the DbRemoteDocument object store itself. Since the previous change
            // log only contained transient data, we can drop its object store.
            !function(t) {
                t.objectStoreNames.contains("remoteDocumentChanges") && t.deleteObjectStore("remoteDocumentChanges");
            }(t);
            // Note: Schema version 9 used to create a read time index for the
            // RemoteDocumentCache. This is now done with schema version 13.
                }))), n < 10 && s >= 10 && (r = r.next((() => this.Qs(i)))), n < 11 && s >= 11 && (r = r.next((() => {
            !function(t) {
                t.createObjectStore("bundles", {
                    keyPath: "bundleId"
                });
            }(t), function(t) {
                t.createObjectStore("namedQueries", {
                    keyPath: "name"
                });
            }(t);
        }))), n < 12 && s >= 12 && (r = r.next((() => {
            !function(t) {
                const e = t.createObjectStore("documentOverlays", {
                    keyPath: ie
                });
                e.createIndex("collectionPathOverlayIndex", re, {
                    unique: !1
                }), e.createIndex("collectionGroupOverlayIndex", oe, {
                    unique: !1
                });
            }(t);
        }))), n < 13 && s >= 13 && (r = r.next((() => function(t) {
            const e = t.createObjectStore("remoteDocumentsV14", {
                keyPath: jt
            });
            e.createIndex("documentKeyIndex", Wt), e.createIndex("collectionGroupIndex", Ht);
        }(t))).next((() => this.zs(t, i))).next((() => t.deleteObjectStore("remoteDocuments")))), 
        n < 14 && s >= 14 && (r = r.next((() => this.js(t, i)))), n < 15 && s >= 15 && (r = r.next((() => function(t) {
            t.createObjectStore("indexConfiguration", {
                keyPath: "indexId",
                autoIncrement: !0
            }).createIndex("collectionGroupIndex", "collectionGroup", {
                unique: !1
            });
            t.createObjectStore("indexState", {
                keyPath: te
            }).createIndex("sequenceNumberIndex", ee, {
                unique: !1
            });
            t.createObjectStore("indexEntries", {
                keyPath: ne
            }).createIndex("documentKeyIndex", se, {
                unique: !1
            });
        }(t)))), r;
    }
    Us(t) {
        let e = 0;
        return t.store("remoteDocuments").Z(((t, n) => {
            e += Yr(n);
        })).next((() => {
            const n = {
                byteSize: e
            };
            return t.store("remoteDocumentGlobal").put("remoteDocumentGlobalKey", n);
        }));
    }
    qs(t) {
        const e = t.store("mutationQueues"), n = t.store("mutations");
        return e.j().next((e => At.forEach(e, (e => {
            const s = IDBKeyRange.bound([ e.userId, -1 ], [ e.userId, e.lastAcknowledgedBatchId ]);
            return n.j("userMutationsIndex", s).next((n => At.forEach(n, (n => {
                $(n.userId === e.userId);
                const s = ur(this.serializer, n);
                return Jr(t, e.userId, s).next((() => {}));
            }))));
        }))));
    }
    /**
     * Ensures that every document in the remote document cache has a corresponding sentinel row
     * with a sequence number. Missing rows are given the most recently used sequence number.
     */    Ks(t) {
        const e = t.store("targetDocuments"), n = t.store("remoteDocuments");
        return t.store("targetGlobal").get("targetGlobalKey").next((t => {
            const s = [];
            return n.Z(((n, i) => {
                const r = new rt(n), o = function(t) {
                    return [ 0, Bt(t) ];
                }(r);
                s.push(e.get(o).next((n => n ? At.resolve() : (n => e.put({
                    targetId: 0,
                    path: Bt(n),
                    sequenceNumber: t.highestListenSequenceNumber
                }))(r))));
            })).next((() => At.waitFor(s)));
        }));
    }
    Gs(t, e) {
        // Create the index.
        t.createObjectStore("collectionParents", {
            keyPath: Xt
        });
        const n = e.store("collectionParents"), s = new Lr, i = t => {
            if (s.add(t)) {
                const e = t.lastSegment(), s = t.popLast();
                return n.put({
                    collectionId: e,
                    parent: Bt(s)
                });
            }
        };
        // Helper to add an index entry iff we haven't already written it.
                // Index existing remote documents.
        return e.store("remoteDocuments").Z({
            Y: !0
        }, ((t, e) => {
            const n = new rt(t);
            return i(n.popLast());
        })).next((() => e.store("documentMutations").Z({
            Y: !0
        }, (([t, e, n], s) => {
            const r = Ut(e);
            return i(r.popLast());
        }))));
    }
    Qs(t) {
        const e = t.store("targets");
        return e.Z(((t, n) => {
            const s = cr(n), i = ar(this.serializer, s);
            return e.put(i);
        }));
    }
    zs(t, e) {
        const n = e.store("remoteDocuments"), s = [];
        return n.Z(((t, n) => {
            const i = e.store("remoteDocumentsV14"), r = (o = n, o.document ? new ct(rt.fromString(o.document.name).popFirst(5)) : o.noDocument ? ct.fromSegments(o.noDocument.path) : o.unknownDocument ? ct.fromSegments(o.unknownDocument.path) : O()).path.toArray();
            var o;
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const u = {
                prefixPath: r.slice(0, r.length - 2),
                collectionGroup: r[r.length - 2],
                documentId: r[r.length - 1],
                readTime: n.readTime || [ 0, 0 ],
                unknownDocument: n.unknownDocument,
                noDocument: n.noDocument,
                document: n.document,
                hasCommittedMutations: !!n.hasCommittedMutations
            };
            s.push(i.put(u));
        })).next((() => At.waitFor(s)));
    }
    js(t, e) {
        const n = e.store("mutations"), s = go(this.serializer), i = new ko($o.Fs, this.serializer.se);
        return n.j().next((t => {
            const n = new Map;
            return t.forEach((t => {
                var e;
                let s = null !== (e = n.get(t.userId)) && void 0 !== e ? e : ws();
                ur(this.serializer, t).keys().forEach((t => s = s.add(t))), n.set(t.userId, s);
            })), At.forEach(n, ((t, n) => {
                const r = new b(n), o = gr.ie(this.serializer, r), u = i.getIndexManager(r), c = Zr.ie(r, this.serializer, u, i.referenceDelegate);
                return new vo(s, c, o, u).recalculateAndSaveOverlaysForDocumentKeys(new fe(e, Ot.ct), t).next();
            }));
        }));
    }
}

function Fo(t) {
    t.createObjectStore("targetDocuments", {
        keyPath: Yt
    }).createIndex("documentTargetsIndex", Zt, {
        unique: !0
    });
    // NOTE: This is unique only because the TargetId is the suffix.
    t.createObjectStore("targets", {
        keyPath: "targetId"
    }).createIndex("queryTargetsIndex", Jt, {
        unique: !0
    }), t.createObjectStore("targetGlobal");
}

const Bo = "Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.";

/**
 * Oldest acceptable age in milliseconds for client metadata before the client
 * is considered inactive and its associated data is garbage collected.
 */
/**
 * An IndexedDB-backed instance of Persistence. Data is stored persistently
 * across sessions.
 *
 * On Web only, the Firestore SDKs support shared access to its persistence
 * layer. This allows multiple browser tabs to read and write to IndexedDb and
 * to synchronize state even without network connectivity. Shared access is
 * currently optional and not enabled unless all clients invoke
 * `enablePersistence()` with `{synchronizeTabs:true}`.
 *
 * In multi-tab mode, if multiple clients are active at the same time, the SDK
 * will designate one client as the “primary client”. An effort is made to pick
 * a visible, network-connected and active client, and this client is
 * responsible for letting other clients know about its presence. The primary
 * client writes a unique client-generated identifier (the client ID) to
 * IndexedDb’s “owner” store every 4 seconds. If the primary client fails to
 * update this entry, another client can acquire the lease and take over as
 * primary.
 *
 * Some persistence operations in the SDK are designated as primary-client only
 * operations. This includes the acknowledgment of mutations and all updates of
 * remote documents. The effects of these operations are written to persistence
 * and then broadcast to other tabs via LocalStorage (see
 * `WebStorageSharedClientState`), which then refresh their state from
 * persistence.
 *
 * Similarly, the primary client listens to notifications sent by secondary
 * clients to discover persistence changes written by secondary clients, such as
 * the addition of new mutations and query targets.
 *
 * If multi-tab is not enabled and another tab already obtained the primary
 * lease, IndexedDbPersistence enters a failed state and all subsequent
 * operations will automatically fail.
 *
 * Additionally, there is an optimization so that when a tab is closed, the
 * primary lease is released immediately (this is especially important to make
 * sure that a refreshed tab is able to immediately re-acquire the primary
 * lease). Unfortunately, IndexedDB cannot be reliably used in window.unload
 * since it is an asynchronous API. So in addition to attempting to give up the
 * lease, the leaseholder writes its client ID to a "zombiedClient" entry in
 * LocalStorage which acts as an indicator that another tab should go ahead and
 * take the primary lease immediately regardless of the current lease timestamp.
 *
 * TODO(b/114226234): Remove `synchronizeTabs` section when multi-tab is no
 * longer optional.
 */
class Lo {
    constructor(
    /**
     * Whether to synchronize the in-memory state of multiple tabs and share
     * access to local persistence.
     */
    t, e, n, s, i, r, o, u, c, 
    /**
     * If set to true, forcefully obtains database access. Existing tabs will
     * no longer be able to access IndexedDB.
     */
    a, h = 15) {
        if (this.allowTabSynchronization = t, this.persistenceKey = e, this.clientId = n, 
        this.Ws = i, this.window = r, this.document = o, this.Hs = c, this.Js = a, this.Ys = h, 
        this.Vs = null, this.Ss = !1, this.isPrimary = !1, this.networkEnabled = !0, 
        /** Our window.unload handler, if registered. */
        this.Zs = null, this.inForeground = !1, 
        /** Our 'visibilitychange' listener if registered. */
        this.Xs = null, 
        /** The client metadata refresh task. */
        this.ti = null, 
        /** The last time we garbage collected the client metadata object store. */
        this.ei = Number.NEGATIVE_INFINITY, 
        /** A listener to notify on primary state changes. */
        this.ni = t => Promise.resolve(), !Lo.D()) throw new L(B.UNIMPLEMENTED, "This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");
        this.referenceDelegate = new fo(this, s), this.si = e + "main", this.serializer = new er(u), 
        this.ii = new vt(this.si, this.Ys, new Mo(this.serializer)), this.Ds = new io(this.referenceDelegate, this.serializer), 
        this.remoteDocumentCache = go(this.serializer), this.xs = new wr, this.window && this.window.localStorage ? this.ri = this.window.localStorage : (this.ri = null, 
        !1 === a && x("IndexedDbPersistence", "LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."));
    }
    /**
     * Attempt to start IndexedDb persistence.
     *
     * @returns Whether persistence was enabled.
     */    start() {
        // NOTE: This is expected to fail sometimes (in the case of another tab
        // already having the persistence lock), so it's the first thing we should
        // do.
        return this.oi().then((() => {
            if (!this.isPrimary && !this.allowTabSynchronization) 
            // Fail `start()` if `synchronizeTabs` is disabled and we cannot
            // obtain the primary lease.
            throw new L(B.FAILED_PRECONDITION, Bo);
            return this.ui(), this.ci(), this.ai(), this.runTransaction("getHighestListenSequenceNumber", "readonly", (t => this.Ds.getHighestSequenceNumber(t)));
        })).then((t => {
            this.Vs = new Ot(t, this.Hs);
        })).then((() => {
            this.Ss = !0;
        })).catch((t => (this.ii && this.ii.close(), Promise.reject(t))));
    }
    /**
     * Registers a listener that gets called when the primary state of the
     * instance changes. Upon registering, this listener is invoked immediately
     * with the current primary state.
     *
     * PORTING NOTE: This is only used for Web multi-tab.
     */    hi(t) {
        return this.ni = async e => {
            if (this.started) return t(e);
        }, t(this.isPrimary);
    }
    /**
     * Registers a listener that gets called when the database receives a
     * version change event indicating that it has deleted.
     *
     * PORTING NOTE: This is only used for Web multi-tab.
     */    setDatabaseDeletedListener(t) {
        this.ii.B((async e => {
            // Check if an attempt is made to delete IndexedDB.
            null === e.newVersion && await t();
        }));
    }
    /**
     * Adjusts the current network state in the client's metadata, potentially
     * affecting the primary lease.
     *
     * PORTING NOTE: This is only used for Web multi-tab.
     */    setNetworkEnabled(t) {
        this.networkEnabled !== t && (this.networkEnabled = t, 
        // Schedule a primary lease refresh for immediate execution. The eventual
        // lease update will be propagated via `primaryStateListener`.
        this.Ws.enqueueAndForget((async () => {
            this.started && await this.oi();
        })));
    }
    /**
     * Updates the client metadata in IndexedDb and attempts to either obtain or
     * extend the primary lease for the local client. Asynchronously notifies the
     * primary state listener if the client either newly obtained or released its
     * primary lease.
     */    oi() {
        return this.runTransaction("updateClientMetadataAndTryBecomePrimary", "readwrite", (t => Uo(t).put({
            clientId: this.clientId,
            updateTimeMs: Date.now(),
            networkEnabled: this.networkEnabled,
            inForeground: this.inForeground
        }).next((() => {
            if (this.isPrimary) return this.li(t).next((t => {
                t || (this.isPrimary = !1, this.Ws.enqueueRetryable((() => this.ni(!1))));
            }));
        })).next((() => this.fi(t))).next((e => this.isPrimary && !e ? this.di(t).next((() => !1)) : !!e && this.wi(t).next((() => !0)))))).catch((t => {
            if (Vt(t)) 
            // Proceed with the existing state. Any subsequent access to
            // IndexedDB will verify the lease.
            return C("IndexedDbPersistence", "Failed to extend owner lease: ", t), this.isPrimary;
            if (!this.allowTabSynchronization) throw t;
            return C("IndexedDbPersistence", "Releasing owner lease after error during lease refresh", t), 
            /* isPrimary= */ !1;
        })).then((t => {
            this.isPrimary !== t && this.Ws.enqueueRetryable((() => this.ni(t))), this.isPrimary = t;
        }));
    }
    li(t) {
        return qo(t).get("owner").next((t => At.resolve(this._i(t))));
    }
    mi(t) {
        return Uo(t).delete(this.clientId);
    }
    /**
     * If the garbage collection threshold has passed, prunes the
     * RemoteDocumentChanges and the ClientMetadata store based on the last update
     * time of all clients.
     */    async gi() {
        if (this.isPrimary && !this.yi(this.ei, 18e5)) {
            this.ei = Date.now();
            const t = await this.runTransaction("maybeGarbageCollectMultiClientState", "readwrite-primary", (t => {
                const e = de(t, "clientMetadata");
                return e.j().next((t => {
                    const n = this.pi(t, 18e5), s = t.filter((t => -1 === n.indexOf(t)));
                    // Delete metadata for clients that are no longer considered active.
                    return At.forEach(s, (t => e.delete(t.clientId))).next((() => s));
                }));
            })).catch((() => []));
            // Delete potential leftover entries that may continue to mark the
            // inactive clients as zombied in LocalStorage.
            // Ideally we'd delete the IndexedDb and LocalStorage zombie entries for
            // the client atomically, but we can't. So we opt to delete the IndexedDb
            // entries first to avoid potentially reviving a zombied client.
                        if (this.ri) for (const e of t) this.ri.removeItem(this.Ii(e.clientId));
        }
    }
    /**
     * Schedules a recurring timer to update the client metadata and to either
     * extend or acquire the primary lease if the client is eligible.
     */    ai() {
        this.ti = this.Ws.enqueueAfterDelay("client_metadata_refresh" /* TimerId.ClientMetadataRefresh */ , 4e3, (() => this.oi().then((() => this.gi())).then((() => this.ai()))));
    }
    /** Checks whether `client` is the local client. */    _i(t) {
        return !!t && t.ownerId === this.clientId;
    }
    /**
     * Evaluate the state of all active clients and determine whether the local
     * client is or can act as the holder of the primary lease. Returns whether
     * the client is eligible for the lease, but does not actually acquire it.
     * May return 'false' even if there is no active leaseholder and another
     * (foreground) client should become leaseholder instead.
     */    fi(t) {
        if (this.Js) return At.resolve(!0);
        return qo(t).get("owner").next((e => {
            // A client is eligible for the primary lease if:
            // - its network is enabled and the client's tab is in the foreground.
            // - its network is enabled and no other client's tab is in the
            //   foreground.
            // - every clients network is disabled and the client's tab is in the
            //   foreground.
            // - every clients network is disabled and no other client's tab is in
            //   the foreground.
            // - the `forceOwningTab` setting was passed in.
            if (null !== e && this.yi(e.leaseTimestampMs, 5e3) && !this.Ti(e.ownerId)) {
                if (this._i(e) && this.networkEnabled) return !0;
                if (!this._i(e)) {
                    if (!e.allowTabSynchronization) 
                    // Fail the `canActAsPrimary` check if the current leaseholder has
                    // not opted into multi-tab synchronization. If this happens at
                    // client startup, we reject the Promise returned by
                    // `enablePersistence()` and the user can continue to use Firestore
                    // with in-memory persistence.
                    // If this fails during a lease refresh, we will instead block the
                    // AsyncQueue from executing further operations. Note that this is
                    // acceptable since mixing & matching different `synchronizeTabs`
                    // settings is not supported.
                    // TODO(b/114226234): Remove this check when `synchronizeTabs` can
                    // no longer be turned off.
                    throw new L(B.FAILED_PRECONDITION, Bo);
                    return !1;
                }
            }
            return !(!this.networkEnabled || !this.inForeground) || Uo(t).j().next((t => void 0 === this.pi(t, 5e3).find((t => {
                if (this.clientId !== t.clientId) {
                    const e = !this.networkEnabled && t.networkEnabled, n = !this.inForeground && t.inForeground, s = this.networkEnabled === t.networkEnabled;
                    if (e || n && s) return !0;
                }
                return !1;
            }))));
        })).next((t => (this.isPrimary !== t && C("IndexedDbPersistence", `Client ${t ? "is" : "is not"} eligible for a primary lease.`), 
        t)));
    }
    async shutdown() {
        // The shutdown() operations are idempotent and can be called even when
        // start() aborted (e.g. because it couldn't acquire the persistence lease).
        this.Ss = !1, this.Ei(), this.ti && (this.ti.cancel(), this.ti = null), this.Ai(), 
        this.Ri(), 
        // Use `SimpleDb.runTransaction` directly to avoid failing if another tab
        // has obtained the primary lease.
        await this.ii.runTransaction("shutdown", "readwrite", [ "owner", "clientMetadata" ], (t => {
            const e = new fe(t, Ot.ct);
            return this.di(e).next((() => this.mi(e)));
        })), this.ii.close(), 
        // Remove the entry marking the client as zombied from LocalStorage since
        // we successfully deleted its metadata from IndexedDb.
        this.vi();
    }
    /**
     * Returns clients that are not zombied and have an updateTime within the
     * provided threshold.
     */    pi(t, e) {
        return t.filter((t => this.yi(t.updateTimeMs, e) && !this.Ti(t.clientId)));
    }
    /**
     * Returns the IDs of the clients that are currently active. If multi-tab
     * is not supported, returns an array that only contains the local client's
     * ID.
     *
     * PORTING NOTE: This is only used for Web multi-tab.
     */    bi() {
        return this.runTransaction("getActiveClients", "readonly", (t => Uo(t).j().next((t => this.pi(t, 18e5).map((t => t.clientId))))));
    }
    get started() {
        return this.Ss;
    }
    getMutationQueue(t, e) {
        return Zr.ie(t, this.serializer, e, this.referenceDelegate);
    }
    getTargetCache() {
        return this.Ds;
    }
    getRemoteDocumentCache() {
        return this.remoteDocumentCache;
    }
    getIndexManager(t) {
        return new Ur(t, this.serializer.se.databaseId);
    }
    getDocumentOverlayCache(t) {
        return gr.ie(this.serializer, t);
    }
    getBundleCache() {
        return this.xs;
    }
    runTransaction(t, e, n) {
        C("IndexedDbPersistence", "Starting transaction:", t);
        const s = "readonly" === e ? "readonly" : "readwrite", i = 15 === (r = this.Ys) ? le : 14 === r ? he : 13 === r ? ae : 12 === r ? ce : 11 === r ? ue : void O();
        /** Returns the object stores for the provided schema. */
        var r;
        let o;
        // Do all transactions as readwrite against all object stores, since we
        // are the only reader/writer.
                return this.ii.runTransaction(t, s, i, (s => (o = new fe(s, this.Vs ? this.Vs.next() : Ot.ct), 
        "readwrite-primary" === e ? this.li(o).next((t => !!t || this.fi(o))).next((e => {
            if (!e) throw x(`Failed to obtain primary lease for action '${t}'.`), this.isPrimary = !1, 
            this.Ws.enqueueRetryable((() => this.ni(!1))), new L(B.FAILED_PRECONDITION, It);
            return n(o);
        })).next((t => this.wi(o).next((() => t)))) : this.Pi(o).next((() => n(o)))))).then((t => (o.raiseOnCommittedEvent(), 
        t)));
    }
    /**
     * Verifies that the current tab is the primary leaseholder or alternatively
     * that the leaseholder has opted into multi-tab synchronization.
     */
    // TODO(b/114226234): Remove this check when `synchronizeTabs` can no longer
    // be turned off.
    Pi(t) {
        return qo(t).get("owner").next((t => {
            if (null !== t && this.yi(t.leaseTimestampMs, 5e3) && !this.Ti(t.ownerId) && !this._i(t) && !(this.Js || this.allowTabSynchronization && t.allowTabSynchronization)) throw new L(B.FAILED_PRECONDITION, Bo);
        }));
    }
    /**
     * Obtains or extends the new primary lease for the local client. This
     * method does not verify that the client is eligible for this lease.
     */    wi(t) {
        const e = {
            ownerId: this.clientId,
            allowTabSynchronization: this.allowTabSynchronization,
            leaseTimestampMs: Date.now()
        };
        return qo(t).put("owner", e);
    }
    static D() {
        return vt.D();
    }
    /** Checks the primary lease and removes it if we are the current primary. */    di(t) {
        const e = qo(t);
        return e.get("owner").next((t => this._i(t) ? (C("IndexedDbPersistence", "Releasing primary lease."), 
        e.delete("owner")) : At.resolve()));
    }
    /** Verifies that `updateTimeMs` is within `maxAgeMs`. */    yi(t, e) {
        const n = Date.now();
        return !(t < n - e) && (!(t > n) || (x(`Detected an update time that is in the future: ${t} > ${n}`), 
        !1));
    }
    ui() {
        null !== this.document && "function" == typeof this.document.addEventListener && (this.Xs = () => {
            this.Ws.enqueueAndForget((() => (this.inForeground = "visible" === this.document.visibilityState, 
            this.oi())));
        }, this.document.addEventListener("visibilitychange", this.Xs), this.inForeground = "visible" === this.document.visibilityState);
    }
    Ai() {
        this.Xs && (this.document.removeEventListener("visibilitychange", this.Xs), this.Xs = null);
    }
    /**
     * Attaches a window.unload handler that will synchronously write our
     * clientId to a "zombie client id" location in LocalStorage. This can be used
     * by tabs trying to acquire the primary lease to determine that the lease
     * is no longer valid even if the timestamp is recent. This is particularly
     * important for the refresh case (so the tab correctly re-acquires the
     * primary lease). LocalStorage is used for this rather than IndexedDb because
     * it is a synchronous API and so can be used reliably from  an unload
     * handler.
     */    ci() {
        var t;
        "function" == typeof (null === (t = this.window) || void 0 === t ? void 0 : t.addEventListener) && (this.Zs = () => {
            // Note: In theory, this should be scheduled on the AsyncQueue since it
            // accesses internal state. We execute this code directly during shutdown
            // to make sure it gets a chance to run.
            this.Ei();
            const t = /(?:Version|Mobile)\/1[456]/;
            isSafari() && (navigator.appVersion.match(t) || navigator.userAgent.match(t)) && 
            // On Safari 14, 15, and 16, we do not run any cleanup actions as it might
            // trigger a bug that prevents Safari from re-opening IndexedDB during
            // the next page load.
            // See https://bugs.webkit.org/show_bug.cgi?id=226547
            this.Ws.enterRestrictedMode(/* purgeExistingTasks= */ !0), this.Ws.enqueueAndForget((() => this.shutdown()));
        }, this.window.addEventListener("pagehide", this.Zs));
    }
    Ri() {
        this.Zs && (this.window.removeEventListener("pagehide", this.Zs), this.Zs = null);
    }
    /**
     * Returns whether a client is "zombied" based on its LocalStorage entry.
     * Clients become zombied when their tab closes without running all of the
     * cleanup logic in `shutdown()`.
     */    Ti(t) {
        var e;
        try {
            const n = null !== (null === (e = this.ri) || void 0 === e ? void 0 : e.getItem(this.Ii(t)));
            return C("IndexedDbPersistence", `Client '${t}' ${n ? "is" : "is not"} zombied in LocalStorage`), 
            n;
        } catch (t) {
            // Gracefully handle if LocalStorage isn't working.
            return x("IndexedDbPersistence", "Failed to get zombied client id.", t), !1;
        }
    }
    /**
     * Record client as zombied (a client that had its tab closed). Zombied
     * clients are ignored during primary tab selection.
     */    Ei() {
        if (this.ri) try {
            this.ri.setItem(this.Ii(this.clientId), String(Date.now()));
        } catch (t) {
            // Gracefully handle if LocalStorage isn't available / working.
            x("Failed to set zombie client id.", t);
        }
    }
    /** Removes the zombied client entry if it exists. */    vi() {
        if (this.ri) try {
            this.ri.removeItem(this.Ii(this.clientId));
        } catch (t) {
            // Ignore
        }
    }
    Ii(t) {
        return `firestore_zombie_${this.persistenceKey}_${t}`;
    }
}

/**
 * Helper to get a typed SimpleDbStore for the primary client object store.
 */ function qo(t) {
    return de(t, "owner");
}

/**
 * Helper to get a typed SimpleDbStore for the client metadata object store.
 */ function Uo(t) {
    return de(t, "clientMetadata");
}

/**
 * Generates a string used as a prefix when storing data in IndexedDB and
 * LocalStorage.
 */ function Ko(t, e) {
    // Use two different prefix formats:
    //   * firestore / persistenceKey / projectID . databaseID / ...
    //   * firestore / persistenceKey / projectID / ...
    // projectIDs are DNS-compatible names and cannot contain dots
    // so there's no danger of collisions.
    let n = t.projectId;
    return t.isDefaultDatabase || (n += "." + t.database), "firestore/" + e + "/" + n + "/";
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A set of changes to what documents are currently in view and out of view for
 * a given query. These changes are sent to the LocalStore by the View (via
 * the SyncEngine) and are used to pin / unpin documents as appropriate.
 */
class Go {
    constructor(t, e, n, s) {
        this.targetId = t, this.fromCache = e, this.Vi = n, this.Si = s;
    }
    static Di(t, e) {
        let n = ws(), s = ws();
        for (const t of e.docChanges) switch (t.type) {
          case 0 /* ChangeType.Added */ :
            n = n.add(t.doc.key);
            break;

          case 1 /* ChangeType.Removed */ :
            s = s.add(t.doc.key);
 // do nothing
                }
        return new Go(t, e.fromCache, n, s);
    }
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * The Firestore query engine.
 *
 * Firestore queries can be executed in three modes. The Query Engine determines
 * what mode to use based on what data is persisted. The mode only determines
 * the runtime complexity of the query - the result set is equivalent across all
 * implementations.
 *
 * The Query engine will use indexed-based execution if a user has configured
 * any index that can be used to execute query (via `setIndexConfiguration()`).
 * Otherwise, the engine will try to optimize the query by re-using a previously
 * persisted query result. If that is not possible, the query will be executed
 * via a full collection scan.
 *
 * Index-based execution is the default when available. The query engine
 * supports partial indexed execution and merges the result from the index
 * lookup with documents that have not yet been indexed. The index evaluation
 * matches the backend's format and as such, the SDK can use indexing for all
 * queries that the backend supports.
 *
 * If no index exists, the query engine tries to take advantage of the target
 * document mapping in the TargetCache. These mappings exists for all queries
 * that have been synced with the backend at least once and allow the query
 * engine to only read documents that previously matched a query plus any
 * documents that were edited after the query was last listened to.
 *
 * There are some cases when this optimization is not guaranteed to produce
 * the same results as full collection scans. In these cases, query
 * processing falls back to full scans. These cases are:
 *
 * - Limit queries where a document that matched the query previously no longer
 *   matches the query.
 *
 * - Limit queries where a document edit may cause the document to sort below
 *   another document that is in the local cache.
 *
 * - Queries that have never been CURRENT or free of limbo documents.
 */ class Qo {
    constructor() {
        this.Ci = !1;
    }
    /** Sets the document view to query against. */    initialize(t, e) {
        this.xi = t, this.indexManager = e, this.Ci = !0;
    }
    /** Returns all local documents matching the specified query. */    getDocumentsMatchingQuery(t, e, n, s) {
        return this.Ni(t, e).next((i => i || this.ki(t, e, s, n))).next((n => n || this.Oi(t, e)));
    }
    /**
     * Performs an indexed query that evaluates the query based on a collection's
     * persisted index values. Returns `null` if an index is not available.
     */    Ni(t, e) {
        if (Un(e)) 
        // Queries that match all documents don't benefit from using
        // key-based lookups. It is more efficient to scan all documents in a
        // collection, rather than to perform individual lookups.
        return At.resolve(null);
        let n = jn(e);
        return this.indexManager.getIndexType(t, n).next((s => 0 /* IndexType.NONE */ === s ? null : (null !== e.limit && 1 /* IndexType.PARTIAL */ === s && (
        // We cannot apply a limit for targets that are served using a partial
        // index. If a partial index will be used to serve the target, the
        // query may return a superset of documents that match the target
        // (e.g. if the index doesn't include all the target's filters), or
        // may return the correct set of documents in the wrong order (e.g. if
        // the index doesn't include a segment for one of the orderBys).
        // Therefore, a limit should not be applied in such cases.
        e = Hn(e, null, "F" /* LimitType.First */), n = jn(e)), this.indexManager.getDocumentsMatchingTarget(t, n).next((s => {
            const i = ws(...s);
            return this.xi.getDocuments(t, i).next((s => this.indexManager.getMinOffset(t, n).next((n => {
                const r = this.$i(e, s);
                return this.Mi(e, r, i, n.readTime) ? this.Ni(t, Hn(e, null, "F" /* LimitType.First */)) : this.Fi(t, r, e, n);
            }))));
        })))));
    }
    /**
     * Performs a query based on the target's persisted query mapping. Returns
     * `null` if the mapping is not available or cannot be used.
     */    ki(t, e, n, s) {
        return Un(e) || s.isEqual(st.min()) ? this.Oi(t, e) : this.xi.getDocuments(t, n).next((i => {
            const r = this.$i(e, i);
            return this.Mi(e, r, n, s) ? this.Oi(t, e) : (S() <= LogLevel.DEBUG && C("QueryEngine", "Re-using previous result from %s to execute query: %s", s.toString(), Zn(e)), 
            this.Fi(t, r, e, mt(s, -1)));
        }));
        // Queries that have never seen a snapshot without limbo free documents
        // should also be run as a full collection scan.
        }
    /** Applies the query filter and sorting to the provided documents.  */    $i(t, e) {
        // Sort the documents and re-apply the query filter since previously
        // matching documents do not necessarily still match the query.
        let n = new Ie(es(t));
        return e.forEach(((e, s) => {
            Xn(t, s) && (n = n.add(s));
        })), n;
    }
    /**
     * Determines if a limit query needs to be refilled from cache, making it
     * ineligible for index-free execution.
     *
     * @param query - The query.
     * @param sortedPreviousResults - The documents that matched the query when it
     * was last synchronized, sorted by the query's comparator.
     * @param remoteKeys - The document keys that matched the query at the last
     * snapshot.
     * @param limboFreeSnapshotVersion - The version of the snapshot when the
     * query was last synchronized.
     */    Mi(t, e, n, s) {
        if (null === t.limit) 
        // Queries without limits do not need to be refilled.
        return !1;
        if (n.size !== e.size) 
        // The query needs to be refilled if a previously matching document no
        // longer matches.
        return !0;
        // Limit queries are not eligible for index-free query execution if there is
        // a potential that an older document from cache now sorts before a document
        // that was previously part of the limit. This, however, can only happen if
        // the document at the edge of the limit goes out of limit.
        // If a document that is not the limit boundary sorts differently,
        // the boundary of the limit itself did not change and documents from cache
        // will continue to be "rejected" by this boundary. Therefore, we can ignore
        // any modifications that don't affect the last document.
                const i = "F" /* LimitType.First */ === t.limitType ? e.last() : e.first();
        return !!i && (i.hasPendingWrites || i.version.compareTo(s) > 0);
    }
    Oi(t, e) {
        return S() <= LogLevel.DEBUG && C("QueryEngine", "Using full collection scan to execute query:", Zn(e)), 
        this.xi.getDocumentsMatchingQuery(t, e, yt.min());
    }
    /**
     * Combines the results from an indexed execution with the remaining documents
     * that have not yet been indexed.
     */    Fi(t, e, n, s) {
        // Retrieve all results for documents that were updated since the offset.
        return this.xi.getDocumentsMatchingQuery(t, n, s).next((t => (
        // Merge with existing results
        e.forEach((e => {
            t = t.insert(e.key, e);
        })), t)));
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Implements `LocalStore` interface.
 *
 * Note: some field defined in this class might have public access level, but
 * the class is not exported so they are only accessible from this module.
 * This is useful to implement optional features (like bundles) in free
 * functions, such that they are tree-shakeable.
 */
class zo {
    constructor(
    /** Manages our in-memory or durable persistence. */
    t, e, n, s) {
        this.persistence = t, this.Bi = e, this.serializer = s, 
        /**
         * Maps a targetID to data about its target.
         *
         * PORTING NOTE: We are using an immutable data structure on Web to make re-runs
         * of `applyRemoteEvent()` idempotent.
         */
        this.Li = new ge(X), 
        /** Maps a target to its targetID. */
        // TODO(wuandy): Evaluate if TargetId can be part of Target.
        this.qi = new ss((t => Nn(t)), kn), 
        /**
         * A per collection group index of the last read time processed by
         * `getNewDocumentChanges()`.
         *
         * PORTING NOTE: This is only used for multi-tab synchronization.
         */
        this.Ui = new Map, this.Ki = t.getRemoteDocumentCache(), this.Ds = t.getTargetCache(), 
        this.xs = t.getBundleCache(), this.Gi(n);
    }
    Gi(t) {
        // TODO(indexing): Add spec tests that test these components change after a
        // user change
        this.documentOverlayCache = this.persistence.getDocumentOverlayCache(t), this.indexManager = this.persistence.getIndexManager(t), 
        this.mutationQueue = this.persistence.getMutationQueue(t, this.indexManager), this.localDocuments = new vo(this.Ki, this.mutationQueue, this.documentOverlayCache, this.indexManager), 
        this.Ki.setIndexManager(this.indexManager), this.Bi.initialize(this.localDocuments, this.indexManager);
    }
    collectGarbage(t) {
        return this.persistence.runTransaction("Collect garbage", "readwrite-primary", (e => t.collect(e, this.Li)));
    }
}

function jo(
/** Manages our in-memory or durable persistence. */
t, e, n, s) {
    return new zo(t, e, n, s);
}

/**
 * Tells the LocalStore that the currently authenticated user has changed.
 *
 * In response the local store switches the mutation queue to the new user and
 * returns any resulting document changes.
 */
// PORTING NOTE: Android and iOS only return the documents affected by the
// change.
async function Wo(t, e) {
    const n = F(t);
    return await n.persistence.runTransaction("Handle user change", "readonly", (t => {
        // Swap out the mutation queue, grabbing the pending mutation batches
        // before and after.
        let s;
        return n.mutationQueue.getAllMutationBatches(t).next((i => (s = i, n.Gi(e), n.mutationQueue.getAllMutationBatches(t)))).next((e => {
            const i = [], r = [];
            // Union the old/new changed keys.
            let o = ws();
            for (const t of s) {
                i.push(t.batchId);
                for (const e of t.mutations) o = o.add(e.key);
            }
            for (const t of e) {
                r.push(t.batchId);
                for (const e of t.mutations) o = o.add(e.key);
            }
            // Return the set of all (potentially) changed documents and the list
            // of mutation batch IDs that were affected by change.
                        return n.localDocuments.getDocuments(t, o).next((t => ({
                Qi: t,
                removedBatchIds: i,
                addedBatchIds: r
            })));
        }));
    }));
}

/* Accepts locally generated Mutations and commit them to storage. */
/**
 * Acknowledges the given batch.
 *
 * On the happy path when a batch is acknowledged, the local store will
 *
 *  + remove the batch from the mutation queue;
 *  + apply the changes to the remote document cache;
 *  + recalculate the latency compensated view implied by those changes (there
 *    may be mutations in the queue that affect the documents but haven't been
 *    acknowledged yet); and
 *  + give the changed documents back the sync engine
 *
 * @returns The resulting (modified) documents.
 */
function Ho(t, e) {
    const n = F(t);
    return n.persistence.runTransaction("Acknowledge batch", "readwrite-primary", (t => {
        const s = e.batch.keys(), i = n.Ki.newChangeBuffer({
            trackRemovals: !0
        });
        return function(t, e, n, s) {
            const i = n.batch, r = i.keys();
            let o = At.resolve();
            return r.forEach((t => {
                o = o.next((() => s.getEntry(e, t))).next((e => {
                    const r = n.docVersions.get(t);
                    $(null !== r), e.version.compareTo(r) < 0 && (i.applyToRemoteDocument(e, n), e.isValidDocument() && (
                    // We use the commitVersion as the readTime rather than the
                    // document's updateTime since the updateTime is not advanced
                    // for updates that do not modify the underlying document.
                    e.setReadTime(n.commitVersion), s.addEntry(e)));
                }));
            })), o.next((() => t.mutationQueue.removeMutationBatch(e, i)));
        }
        /** Returns the local view of the documents affected by a mutation batch. */
        // PORTING NOTE: Multi-Tab only.
        (n, t, e, i).next((() => i.apply(t))).next((() => n.mutationQueue.performConsistencyCheck(t))).next((() => n.documentOverlayCache.removeOverlaysForBatchId(t, s, e.batch.batchId))).next((() => n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(t, function(t) {
            let e = ws();
            for (let n = 0; n < t.mutationResults.length; ++n) {
                t.mutationResults[n].transformResults.length > 0 && (e = e.add(t.batch.mutations[n].key));
            }
            return e;
        }
        /**
 * Removes mutations from the MutationQueue for the specified batch;
 * LocalDocuments will be recalculated.
 *
 * @returns The resulting modified documents.
 */ (e)))).next((() => n.localDocuments.getDocuments(t, s)));
    }));
}

/**
 * Returns the last consistent snapshot processed (used by the RemoteStore to
 * determine whether to buffer incoming snapshots from the backend).
 */
function Jo(t) {
    const e = F(t);
    return e.persistence.runTransaction("Get last remote snapshot version", "readonly", (t => e.Ds.getLastRemoteSnapshotVersion(t)));
}

/**
 * Updates the "ground-state" (remote) documents. We assume that the remote
 * event reflects any write batches that have been acknowledged or rejected
 * (i.e. we do not re-apply local mutations to updates from this event).
 *
 * LocalDocuments are re-calculated if there are remaining mutations in the
 * queue.
 */ function Yo(t, e) {
    const n = F(t), s = e.snapshotVersion;
    let i = n.Li;
    return n.persistence.runTransaction("Apply remote event", "readwrite-primary", (t => {
        const r = n.Ki.newChangeBuffer({
            trackRemovals: !0
        });
        // Reset newTargetDataByTargetMap in case this transaction gets re-run.
                i = n.Li;
        const o = [];
        e.targetChanges.forEach(((r, u) => {
            const c = i.get(u);
            if (!c) return;
            // Only update the remote keys if the target is still active. This
            // ensures that we can persist the updated target data along with
            // the updated assignment.
                        o.push(n.Ds.removeMatchingKeys(t, r.removedDocuments, u).next((() => n.Ds.addMatchingKeys(t, r.addedDocuments, u))));
            let a = c.withSequenceNumber(t.currentSequenceNumber);
            e.targetMismatches.has(u) ? a = a.withResumeToken(be.EMPTY_BYTE_STRING, st.min()).withLastLimboFreeSnapshotVersion(st.min()) : r.resumeToken.approximateByteSize() > 0 && (a = a.withResumeToken(r.resumeToken, s)), 
            i = i.insert(u, a), 
            // Update the target data if there are target changes (or if
            // sufficient time has passed since the last update).
            /**
 * Returns true if the newTargetData should be persisted during an update of
 * an active target. TargetData should always be persisted when a target is
 * being released and should not call this function.
 *
 * While the target is active, TargetData updates can be omitted when nothing
 * about the target has changed except metadata like the resume token or
 * snapshot version. Occasionally it's worth the extra write to prevent these
 * values from getting too stale after a crash, but this doesn't have to be
 * too frequent.
 */
            function(t, e, n) {
                // Always persist target data if we don't already have a resume token.
                if (0 === t.resumeToken.approximateByteSize()) return !0;
                // Don't allow resume token changes to be buffered indefinitely. This
                // allows us to be reasonably up-to-date after a crash and avoids needing
                // to loop over all active queries on shutdown. Especially in the browser
                // we may not get time to do anything interesting while the current tab is
                // closing.
                                if (e.snapshotVersion.toMicroseconds() - t.snapshotVersion.toMicroseconds() >= 3e8) return !0;
                // Otherwise if the only thing that has changed about a target is its resume
                // token it's not worth persisting. Note that the RemoteStore keeps an
                // in-memory view of the currently active targets which includes the current
                // resume token, so stream failure or user changes will still use an
                // up-to-date resume token regardless of what we do here.
                                return n.addedDocuments.size + n.modifiedDocuments.size + n.removedDocuments.size > 0;
            }
            /**
 * Notifies local store of the changed views to locally pin documents.
 */ (c, a, r) && o.push(n.Ds.updateTargetData(t, a));
        }));
        let u = rs(), c = ws();
        // HACK: The only reason we allow a null snapshot version is so that we
        // can synthesize remote events when we get permission denied errors while
        // trying to resolve the state of a locally cached document that is in
        // limbo.
        if (e.documentUpdates.forEach((s => {
            e.resolvedLimboDocuments.has(s) && o.push(n.persistence.referenceDelegate.updateLimboDocument(t, s));
        })), 
        // Each loop iteration only affects its "own" doc, so it's safe to get all
        // the remote documents in advance in a single call.
        o.push(Zo(t, r, e.documentUpdates).next((t => {
            u = t.zi, c = t.ji;
        }))), !s.isEqual(st.min())) {
            const e = n.Ds.getLastRemoteSnapshotVersion(t).next((e => n.Ds.setTargetsMetadata(t, t.currentSequenceNumber, s)));
            o.push(e);
        }
        return At.waitFor(o).next((() => r.apply(t))).next((() => n.localDocuments.getLocalViewOfDocuments(t, u, c))).next((() => u));
    })).then((t => (n.Li = i, t)));
}

/**
 * Populates document change buffer with documents from backend or a bundle.
 * Returns the document changes resulting from applying those documents, and
 * also a set of documents whose existence state are changed as a result.
 *
 * @param txn - Transaction to use to read existing documents from storage.
 * @param documentBuffer - Document buffer to collect the resulted changes to be
 *        applied to storage.
 * @param documents - Documents to be applied.
 */ function Zo(t, e, n) {
    let s = ws(), i = ws();
    return n.forEach((t => s = s.add(t))), e.getEntries(t, s).next((t => {
        let s = rs();
        return n.forEach(((n, r) => {
            const o = t.get(n);
            // Check if see if there is a existence state change for this document.
                        r.isFoundDocument() !== o.isFoundDocument() && (i = i.add(n)), 
            // Note: The order of the steps below is important, since we want
            // to ensure that rejected limbo resolutions (which fabricate
            // NoDocuments with SnapshotVersion.min()) never add documents to
            // cache.
            r.isNoDocument() && r.version.isEqual(st.min()) ? (
            // NoDocuments with SnapshotVersion.min() are used in manufactured
            // events. We remove these documents from cache since we lost
            // access.
            e.removeEntry(n, r.readTime), s = s.insert(n, r)) : !o.isValidDocument() || r.version.compareTo(o.version) > 0 || 0 === r.version.compareTo(o.version) && o.hasPendingWrites ? (e.addEntry(r), 
            s = s.insert(n, r)) : C("LocalStore", "Ignoring outdated watch update for ", n, ". Current version:", o.version, " Watch version:", r.version);
        })), {
            zi: s,
            ji: i
        };
    }));
}

/**
 * Gets the mutation batch after the passed in batchId in the mutation queue
 * or null if empty.
 * @param afterBatchId - If provided, the batch to search after.
 * @returns The next mutation or null if there wasn't one.
 */
function Xo(t, e) {
    const n = F(t);
    return n.persistence.runTransaction("Get next mutation batch", "readonly", (t => (void 0 === e && (e = -1), 
    n.mutationQueue.getNextMutationBatchAfterBatchId(t, e))));
}

/**
 * Reads the current value of a Document with a given key or null if not
 * found - used for testing.
 */
/**
 * Assigns the given target an internal ID so that its results can be pinned so
 * they don't get GC'd. A target must be allocated in the local store before
 * the store can be used to manage its view.
 *
 * Allocating an already allocated `Target` will return the existing `TargetData`
 * for that `Target`.
 */
function tu(t, e) {
    const n = F(t);
    return n.persistence.runTransaction("Allocate target", "readwrite", (t => {
        let s;
        return n.Ds.getTargetData(t, e).next((i => i ? (
        // This target has been listened to previously, so reuse the
        // previous targetID.
        // TODO(mcg): freshen last accessed date?
        s = i, At.resolve(s)) : n.Ds.allocateTargetId(t).next((i => (s = new tr(e, i, 0 /* TargetPurpose.Listen */ , t.currentSequenceNumber), 
        n.Ds.addTargetData(t, s).next((() => s)))))));
    })).then((t => {
        // If Multi-Tab is enabled, the existing target data may be newer than
        // the in-memory data
        const s = n.Li.get(t.targetId);
        return (null === s || t.snapshotVersion.compareTo(s.snapshotVersion) > 0) && (n.Li = n.Li.insert(t.targetId, t), 
        n.qi.set(e, t.targetId)), t;
    }));
}

/**
 * Returns the TargetData as seen by the LocalStore, including updates that may
 * have not yet been persisted to the TargetCache.
 */
// Visible for testing.
/**
 * Unpins all the documents associated with the given target. If
 * `keepPersistedTargetData` is set to false and Eager GC enabled, the method
 * directly removes the associated target data from the target cache.
 *
 * Releasing a non-existing `Target` is a no-op.
 */
// PORTING NOTE: `keepPersistedTargetData` is multi-tab only.
async function eu(t, e, n) {
    const s = F(t), i = s.Li.get(e), r = n ? "readwrite" : "readwrite-primary";
    try {
        n || await s.persistence.runTransaction("Release target", r, (t => s.persistence.referenceDelegate.removeTarget(t, i)));
    } catch (t) {
        if (!Vt(t)) throw t;
        // All `releaseTarget` does is record the final metadata state for the
        // target, but we've been recording this periodically during target
        // activity. If we lose this write this could cause a very slight
        // difference in the order of target deletion during GC, but we
        // don't define exact LRU semantics so this is acceptable.
        C("LocalStore", `Failed to update sequence numbers for target ${e}: ${t}`);
    }
    s.Li = s.Li.remove(e), s.qi.delete(i.target);
}

/**
 * Runs the specified query against the local store and returns the results,
 * potentially taking advantage of query data from previous executions (such
 * as the set of remote keys).
 *
 * @param usePreviousResults - Whether results from previous executions can
 * be used to optimize this query execution.
 */ function nu(t, e, n) {
    const s = F(t);
    let i = st.min(), r = ws();
    return s.persistence.runTransaction("Execute query", "readonly", (t => function(t, e, n) {
        const s = F(t), i = s.qi.get(n);
        return void 0 !== i ? At.resolve(s.Li.get(i)) : s.Ds.getTargetData(e, n);
    }(s, t, jn(e)).next((e => {
        if (e) return i = e.lastLimboFreeSnapshotVersion, s.Ds.getMatchingKeysForTargetId(t, e.targetId).next((t => {
            r = t;
        }));
    })).next((() => s.Bi.getDocumentsMatchingQuery(t, e, n ? i : st.min(), n ? r : ws()))).next((t => (ru(s, ts(e), t), 
    {
        documents: t,
        Wi: r
    })))));
}

// PORTING NOTE: Multi-Tab only.
function su(t, e) {
    const n = F(t), s = F(n.Ds), i = n.Li.get(e);
    return i ? Promise.resolve(i.target) : n.persistence.runTransaction("Get target data", "readonly", (t => s.ne(t, e).next((t => t ? t.target : null))));
}

/**
 * Returns the set of documents that have been updated since the last call.
 * If this is the first call, returns the set of changes since client
 * initialization. Further invocations will return document that have changed
 * since the prior call.
 */
// PORTING NOTE: Multi-Tab only.
function iu(t, e) {
    const n = F(t), s = n.Ui.get(e) || st.min();
    // Get the current maximum read time for the collection. This should always
    // exist, but to reduce the chance for regressions we default to
    // SnapshotVersion.Min()
    // TODO(indexing): Consider removing the default value.
        return n.persistence.runTransaction("Get new document changes", "readonly", (t => n.Ki.getAllFromCollectionGroup(t, e, mt(s, -1), 
    /* limit= */ Number.MAX_SAFE_INTEGER))).then((t => (ru(n, e, t), t)));
}

/** Sets the collection group's maximum read time from the given documents. */
// PORTING NOTE: Multi-Tab only.
function ru(t, e, n) {
    let s = t.Ui.get(e) || st.min();
    n.forEach(((t, e) => {
        e.readTime.compareTo(s) > 0 && (s = e.readTime);
    })), t.Ui.set(e, s);
}

/**
 * Creates a new target using the given bundle name, which will be used to
 * hold the keys of all documents from the bundle in query-document mappings.
 * This ensures that the loaded documents do not get garbage collected
 * right away.
 */
/**
 * Applies the documents from a bundle to the "ground-state" (remote)
 * documents.
 *
 * LocalDocuments are re-calculated if there are remaining mutations in the
 * queue.
 */
async function ou(t, e, n, s) {
    const i = F(t);
    let r = ws(), o = rs();
    for (const t of n) {
        const n = e.Hi(t.metadata.name);
        t.document && (r = r.add(n));
        const s = e.Ji(t);
        s.setReadTime(e.Yi(t.metadata.readTime)), o = o.insert(n, s);
    }
    const u = i.Ki.newChangeBuffer({
        trackRemovals: !0
    }), c = await tu(i, function(t) {
        // It is OK that the path used for the query is not valid, because this will
        // not be read and queried.
        return jn(qn(rt.fromString(`__bundle__/docs/${t}`)));
    }(s));
    // Allocates a target to hold all document keys from the bundle, such that
    // they will not get garbage collected right away.
        return i.persistence.runTransaction("Apply bundle documents", "readwrite", (t => Zo(t, u, o).next((e => (u.apply(t), 
    e))).next((e => i.Ds.removeMatchingKeysForTargetId(t, c.targetId).next((() => i.Ds.addMatchingKeys(t, r, c.targetId))).next((() => i.localDocuments.getLocalViewOfDocuments(t, e.zi, e.ji))).next((() => e.zi))))));
}

/**
 * Returns a promise of a boolean to indicate if the given bundle has already
 * been loaded and the create time is newer than the current loading bundle.
 */
/**
 * Saves the given `NamedQuery` to local persistence.
 */
async function uu(t, e, n = ws()) {
    // Allocate a target for the named query such that it can be resumed
    // from associated read time if users use it to listen.
    // NOTE: this also means if no corresponding target exists, the new target
    // will remain active and will not get collected, unless users happen to
    // unlisten the query somehow.
    const s = await tu(t, jn(hr(e.bundledQuery))), i = F(t);
    return i.persistence.runTransaction("Save named query", "readwrite", (t => {
        const r = vi(e.readTime);
        // Simply save the query itself if it is older than what the SDK already
        // has.
                if (s.snapshotVersion.compareTo(r) >= 0) return i.xs.saveNamedQuery(t, e);
        // Update existing target data because the query from the bundle is newer.
                const o = s.withResumeToken(be.EMPTY_BYTE_STRING, r);
        return i.Li = i.Li.insert(o.targetId, o), i.Ds.updateTargetData(t, o).next((() => i.Ds.removeMatchingKeysForTargetId(t, s.targetId))).next((() => i.Ds.addMatchingKeys(t, n, s.targetId))).next((() => i.xs.saveNamedQuery(t, e)));
    }));
}

/** Assembles the key for a client state in WebStorage */
function cu(t, e) {
    return `firestore_clients_${t}_${e}`;
}

// The format of the WebStorage key that stores the mutation state is:
//     firestore_mutations_<persistence_prefix>_<batch_id>
//     (for unauthenticated users)
// or: firestore_mutations_<persistence_prefix>_<batch_id>_<user_uid>

// 'user_uid' is last to avoid needing to escape '_' characters that it might
// contain.
/** Assembles the key for a mutation batch in WebStorage */
function au(t, e, n) {
    let s = `firestore_mutations_${t}_${n}`;
    return e.isAuthenticated() && (s += `_${e.uid}`), s;
}

// The format of the WebStorage key that stores a query target's metadata is:
//     firestore_targets_<persistence_prefix>_<target_id>
/** Assembles the key for a query state in WebStorage */
function hu(t, e) {
    return `firestore_targets_${t}_${e}`;
}

// The WebStorage prefix that stores the primary tab's online state. The
// format of the key is:
//     firestore_online_state_<persistence_prefix>
/**
 * Holds the state of a mutation batch, including its user ID, batch ID and
 * whether the batch is 'pending', 'acknowledged' or 'rejected'.
 */
// Visible for testing
class lu {
    constructor(t, e, n, s) {
        this.user = t, this.batchId = e, this.state = n, this.error = s;
    }
    /**
     * Parses a MutationMetadata from its JSON representation in WebStorage.
     * Logs a warning and returns null if the format of the data is not valid.
     */    static Zi(t, e, n) {
        const s = JSON.parse(n);
        let i, r = "object" == typeof s && -1 !== [ "pending", "acknowledged", "rejected" ].indexOf(s.state) && (void 0 === s.error || "object" == typeof s.error);
        return r && s.error && (r = "string" == typeof s.error.message && "string" == typeof s.error.code, 
        r && (i = new L(s.error.code, s.error.message))), r ? new lu(t, e, s.state, i) : (x("SharedClientState", `Failed to parse mutation state for ID '${e}': ${n}`), 
        null);
    }
    Xi() {
        const t = {
            state: this.state,
            updateTimeMs: Date.now()
        };
        return this.error && (t.error = {
            code: this.error.code,
            message: this.error.message
        }), JSON.stringify(t);
    }
}

/**
 * Holds the state of a query target, including its target ID and whether the
 * target is 'not-current', 'current' or 'rejected'.
 */
// Visible for testing
class fu {
    constructor(t, e, n) {
        this.targetId = t, this.state = e, this.error = n;
    }
    /**
     * Parses a QueryTargetMetadata from its JSON representation in WebStorage.
     * Logs a warning and returns null if the format of the data is not valid.
     */    static Zi(t, e) {
        const n = JSON.parse(e);
        let s, i = "object" == typeof n && -1 !== [ "not-current", "current", "rejected" ].indexOf(n.state) && (void 0 === n.error || "object" == typeof n.error);
        return i && n.error && (i = "string" == typeof n.error.message && "string" == typeof n.error.code, 
        i && (s = new L(n.error.code, n.error.message))), i ? new fu(t, n.state, s) : (x("SharedClientState", `Failed to parse target state for ID '${t}': ${e}`), 
        null);
    }
    Xi() {
        const t = {
            state: this.state,
            updateTimeMs: Date.now()
        };
        return this.error && (t.error = {
            code: this.error.code,
            message: this.error.message
        }), JSON.stringify(t);
    }
}

/**
 * This class represents the immutable ClientState for a client read from
 * WebStorage, containing the list of active query targets.
 */ class du {
    constructor(t, e) {
        this.clientId = t, this.activeTargetIds = e;
    }
    /**
     * Parses a RemoteClientState from the JSON representation in WebStorage.
     * Logs a warning and returns null if the format of the data is not valid.
     */    static Zi(t, e) {
        const n = JSON.parse(e);
        let s = "object" == typeof n && n.activeTargetIds instanceof Array, i = ms();
        for (let t = 0; s && t < n.activeTargetIds.length; ++t) s = Ft(n.activeTargetIds[t]), 
        i = i.add(n.activeTargetIds[t]);
        return s ? new du(t, i) : (x("SharedClientState", `Failed to parse client data for instance '${t}': ${e}`), 
        null);
    }
}

/**
 * This class represents the online state for all clients participating in
 * multi-tab. The online state is only written to by the primary client, and
 * used in secondary clients to update their query views.
 */ class wu {
    constructor(t, e) {
        this.clientId = t, this.onlineState = e;
    }
    /**
     * Parses a SharedOnlineState from its JSON representation in WebStorage.
     * Logs a warning and returns null if the format of the data is not valid.
     */    static Zi(t) {
        const e = JSON.parse(t);
        return "object" == typeof e && -1 !== [ "Unknown", "Online", "Offline" ].indexOf(e.onlineState) && "string" == typeof e.clientId ? new wu(e.clientId, e.onlineState) : (x("SharedClientState", `Failed to parse online state: ${t}`), 
        null);
    }
}

/**
 * Metadata state of the local client. Unlike `RemoteClientState`, this class is
 * mutable and keeps track of all pending mutations, which allows us to
 * update the range of pending mutation batch IDs as new mutations are added or
 * removed.
 *
 * The data in `LocalClientState` is not read from WebStorage and instead
 * updated via its instance methods. The updated state can be serialized via
 * `toWebStorageJSON()`.
 */
// Visible for testing.
class _u {
    constructor() {
        this.activeTargetIds = ms();
    }
    tr(t) {
        this.activeTargetIds = this.activeTargetIds.add(t);
    }
    er(t) {
        this.activeTargetIds = this.activeTargetIds.delete(t);
    }
    /**
     * Converts this entry into a JSON-encoded format we can use for WebStorage.
     * Does not encode `clientId` as it is part of the key in WebStorage.
     */    Xi() {
        const t = {
            activeTargetIds: this.activeTargetIds.toArray(),
            updateTimeMs: Date.now()
        };
        return JSON.stringify(t);
    }
}

/**
 * `WebStorageSharedClientState` uses WebStorage (window.localStorage) as the
 * backing store for the SharedClientState. It keeps track of all active
 * clients and supports modifications of the local client's data.
 */ class mu {
    constructor(t, e, n, s, i) {
        this.window = t, this.Ws = e, this.persistenceKey = n, this.nr = s, this.syncEngine = null, 
        this.onlineStateHandler = null, this.sequenceNumberHandler = null, this.sr = this.ir.bind(this), 
        this.rr = new ge(X), this.started = !1, 
        /**
         * Captures WebStorage events that occur before `start()` is called. These
         * events are replayed once `WebStorageSharedClientState` is started.
         */
        this.ur = [];
        // Escape the special characters mentioned here:
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
        const r = n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        this.storage = this.window.localStorage, this.currentUser = i, this.cr = cu(this.persistenceKey, this.nr), 
        this.ar = 
        /** Assembles the key for the current sequence number. */
        function(t) {
            return `firestore_sequence_number_${t}`;
        }
        /**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ (this.persistenceKey), this.rr = this.rr.insert(this.nr, new _u), this.hr = new RegExp(`^firestore_clients_${r}_([^_]*)$`), 
        this.lr = new RegExp(`^firestore_mutations_${r}_(\\d+)(?:_(.*))?$`), this.dr = new RegExp(`^firestore_targets_${r}_(\\d+)$`), 
        this.wr = 
        /** Assembles the key for the online state of the primary tab. */
        function(t) {
            return `firestore_online_state_${t}`;
        }
        // The WebStorage prefix that plays as a event to indicate the remote documents
        // might have changed due to some secondary tabs loading a bundle.
        // format of the key is:
        //     firestore_bundle_loaded_v2_<persistenceKey>
        // The version ending with "v2" stores the list of modified collection groups.
        (this.persistenceKey), this._r = function(t) {
            return `firestore_bundle_loaded_v2_${t}`;
        }
        // The WebStorage key prefix for the key that stores the last sequence number allocated. The key
        // looks like 'firestore_sequence_number_<persistence_prefix>'.
        (this.persistenceKey), 
        // Rather than adding the storage observer during start(), we add the
        // storage observer during initialization. This ensures that we collect
        // events before other components populate their initial state (during their
        // respective start() calls). Otherwise, we might for example miss a
        // mutation that is added after LocalStore's start() processed the existing
        // mutations but before we observe WebStorage events.
        this.window.addEventListener("storage", this.sr);
    }
    /** Returns 'true' if WebStorage is available in the current environment. */    static D(t) {
        return !(!t || !t.localStorage);
    }
    async start() {
        // Retrieve the list of existing clients to backfill the data in
        // SharedClientState.
        const t = await this.syncEngine.bi();
        for (const e of t) {
            if (e === this.nr) continue;
            const t = this.getItem(cu(this.persistenceKey, e));
            if (t) {
                const n = du.Zi(e, t);
                n && (this.rr = this.rr.insert(n.clientId, n));
            }
        }
        this.mr();
        // Check if there is an existing online state and call the callback handler
        // if applicable.
        const e = this.storage.getItem(this.wr);
        if (e) {
            const t = this.gr(e);
            t && this.yr(t);
        }
        for (const t of this.ur) this.ir(t);
        this.ur = [], 
        // Register a window unload hook to remove the client metadata entry from
        // WebStorage even if `shutdown()` was not called.
        this.window.addEventListener("pagehide", (() => this.shutdown())), this.started = !0;
    }
    writeSequenceNumber(t) {
        this.setItem(this.ar, JSON.stringify(t));
    }
    getAllActiveQueryTargets() {
        return this.pr(this.rr);
    }
    isActiveQueryTarget(t) {
        let e = !1;
        return this.rr.forEach(((n, s) => {
            s.activeTargetIds.has(t) && (e = !0);
        })), e;
    }
    addPendingMutation(t) {
        this.Ir(t, "pending");
    }
    updateMutationState(t, e, n) {
        this.Ir(t, e, n), 
        // Once a final mutation result is observed by other clients, they no longer
        // access the mutation's metadata entry. Since WebStorage replays events
        // in order, it is safe to delete the entry right after updating it.
        this.Tr(t);
    }
    addLocalQueryTarget(t) {
        let e = "not-current";
        // Lookup an existing query state if the target ID was already registered
        // by another tab
                if (this.isActiveQueryTarget(t)) {
            const n = this.storage.getItem(hu(this.persistenceKey, t));
            if (n) {
                const s = fu.Zi(t, n);
                s && (e = s.state);
            }
        }
        return this.Er.tr(t), this.mr(), e;
    }
    removeLocalQueryTarget(t) {
        this.Er.er(t), this.mr();
    }
    isLocalQueryTarget(t) {
        return this.Er.activeTargetIds.has(t);
    }
    clearQueryState(t) {
        this.removeItem(hu(this.persistenceKey, t));
    }
    updateQueryState(t, e, n) {
        this.Ar(t, e, n);
    }
    handleUserChange(t, e, n) {
        e.forEach((t => {
            this.Tr(t);
        })), this.currentUser = t, n.forEach((t => {
            this.addPendingMutation(t);
        }));
    }
    setOnlineState(t) {
        this.Rr(t);
    }
    notifyBundleLoaded(t) {
        this.vr(t);
    }
    shutdown() {
        this.started && (this.window.removeEventListener("storage", this.sr), this.removeItem(this.cr), 
        this.started = !1);
    }
    getItem(t) {
        const e = this.storage.getItem(t);
        return C("SharedClientState", "READ", t, e), e;
    }
    setItem(t, e) {
        C("SharedClientState", "SET", t, e), this.storage.setItem(t, e);
    }
    removeItem(t) {
        C("SharedClientState", "REMOVE", t), this.storage.removeItem(t);
    }
    ir(t) {
        // Note: The function is typed to take Event to be interface-compatible with
        // `Window.addEventListener`.
        const e = t;
        if (e.storageArea === this.storage) {
            if (C("SharedClientState", "EVENT", e.key, e.newValue), e.key === this.cr) return void x("Received WebStorage notification for local change. Another client might have garbage-collected our state");
            this.Ws.enqueueRetryable((async () => {
                if (this.started) {
                    if (null !== e.key) if (this.hr.test(e.key)) {
                        if (null == e.newValue) {
                            const t = this.br(e.key);
                            return this.Pr(t, null);
                        }
                        {
                            const t = this.Vr(e.key, e.newValue);
                            if (t) return this.Pr(t.clientId, t);
                        }
                    } else if (this.lr.test(e.key)) {
                        if (null !== e.newValue) {
                            const t = this.Sr(e.key, e.newValue);
                            if (t) return this.Dr(t);
                        }
                    } else if (this.dr.test(e.key)) {
                        if (null !== e.newValue) {
                            const t = this.Cr(e.key, e.newValue);
                            if (t) return this.Nr(t);
                        }
                    } else if (e.key === this.wr) {
                        if (null !== e.newValue) {
                            const t = this.gr(e.newValue);
                            if (t) return this.yr(t);
                        }
                    } else if (e.key === this.ar) {
                        const t = function(t) {
                            let e = Ot.ct;
                            if (null != t) try {
                                const n = JSON.parse(t);
                                $("number" == typeof n), e = n;
                            } catch (t) {
                                x("SharedClientState", "Failed to read sequence number from WebStorage", t);
                            }
                            return e;
                        }
                        /**
 * `MemorySharedClientState` is a simple implementation of SharedClientState for
 * clients using memory persistence. The state in this class remains fully
 * isolated and no synchronization is performed.
 */ (e.newValue);
                        t !== Ot.ct && this.sequenceNumberHandler(t);
                    } else if (e.key === this._r) {
                        const t = this.kr(e.newValue);
                        await Promise.all(t.map((t => this.syncEngine.Or(t))));
                    }
                } else this.ur.push(e);
            }));
        }
    }
    get Er() {
        return this.rr.get(this.nr);
    }
    mr() {
        this.setItem(this.cr, this.Er.Xi());
    }
    Ir(t, e, n) {
        const s = new lu(this.currentUser, t, e, n), i = au(this.persistenceKey, this.currentUser, t);
        this.setItem(i, s.Xi());
    }
    Tr(t) {
        const e = au(this.persistenceKey, this.currentUser, t);
        this.removeItem(e);
    }
    Rr(t) {
        const e = {
            clientId: this.nr,
            onlineState: t
        };
        this.storage.setItem(this.wr, JSON.stringify(e));
    }
    Ar(t, e, n) {
        const s = hu(this.persistenceKey, t), i = new fu(t, e, n);
        this.setItem(s, i.Xi());
    }
    vr(t) {
        const e = JSON.stringify(Array.from(t));
        this.setItem(this._r, e);
    }
    /**
     * Parses a client state key in WebStorage. Returns null if the key does not
     * match the expected key format.
     */    br(t) {
        const e = this.hr.exec(t);
        return e ? e[1] : null;
    }
    /**
     * Parses a client state in WebStorage. Returns 'null' if the value could not
     * be parsed.
     */    Vr(t, e) {
        const n = this.br(t);
        return du.Zi(n, e);
    }
    /**
     * Parses a mutation batch state in WebStorage. Returns 'null' if the value
     * could not be parsed.
     */    Sr(t, e) {
        const n = this.lr.exec(t), s = Number(n[1]), i = void 0 !== n[2] ? n[2] : null;
        return lu.Zi(new b(i), s, e);
    }
    /**
     * Parses a query target state from WebStorage. Returns 'null' if the value
     * could not be parsed.
     */    Cr(t, e) {
        const n = this.dr.exec(t), s = Number(n[1]);
        return fu.Zi(s, e);
    }
    /**
     * Parses an online state from WebStorage. Returns 'null' if the value
     * could not be parsed.
     */    gr(t) {
        return wu.Zi(t);
    }
    kr(t) {
        return JSON.parse(t);
    }
    async Dr(t) {
        if (t.user.uid === this.currentUser.uid) return this.syncEngine.$r(t.batchId, t.state, t.error);
        C("SharedClientState", `Ignoring mutation for non-active user ${t.user.uid}`);
    }
    Nr(t) {
        return this.syncEngine.Mr(t.targetId, t.state, t.error);
    }
    Pr(t, e) {
        const n = e ? this.rr.insert(t, e) : this.rr.remove(t), s = this.pr(this.rr), i = this.pr(n), r = [], o = [];
        return i.forEach((t => {
            s.has(t) || r.push(t);
        })), s.forEach((t => {
            i.has(t) || o.push(t);
        })), this.syncEngine.Fr(r, o).then((() => {
            this.rr = n;
        }));
    }
    yr(t) {
        // We check whether the client that wrote this online state is still active
        // by comparing its client ID to the list of clients kept active in
        // IndexedDb. If a client does not update their IndexedDb client state
        // within 5 seconds, it is considered inactive and we don't emit an online
        // state event.
        this.rr.get(t.clientId) && this.onlineStateHandler(t.onlineState);
    }
    pr(t) {
        let e = ms();
        return t.forEach(((t, n) => {
            e = e.unionWith(n.activeTargetIds);
        })), e;
    }
}

class gu {
    constructor() {
        this.Br = new _u, this.Lr = {}, this.onlineStateHandler = null, this.sequenceNumberHandler = null;
    }
    addPendingMutation(t) {
        // No op.
    }
    updateMutationState(t, e, n) {
        // No op.
    }
    addLocalQueryTarget(t) {
        return this.Br.tr(t), this.Lr[t] || "not-current";
    }
    updateQueryState(t, e, n) {
        this.Lr[t] = e;
    }
    removeLocalQueryTarget(t) {
        this.Br.er(t);
    }
    isLocalQueryTarget(t) {
        return this.Br.activeTargetIds.has(t);
    }
    clearQueryState(t) {
        delete this.Lr[t];
    }
    getAllActiveQueryTargets() {
        return this.Br.activeTargetIds;
    }
    isActiveQueryTarget(t) {
        return this.Br.activeTargetIds.has(t);
    }
    start() {
        return this.Br = new _u, Promise.resolve();
    }
    handleUserChange(t, e, n) {
        // No op.
    }
    setOnlineState(t) {
        // No op.
    }
    shutdown() {}
    writeSequenceNumber(t) {}
    notifyBundleLoaded(t) {
        // No op.
    }
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class yu {
    qr(t) {
        // No-op.
    }
    shutdown() {
        // No-op.
    }
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// References to `window` are guarded by BrowserConnectivityMonitor.isAvailable()
/* eslint-disable no-restricted-globals */
/**
 * Browser implementation of ConnectivityMonitor.
 */
class pu {
    constructor() {
        this.Ur = () => this.Kr(), this.Gr = () => this.Qr(), this.zr = [], this.jr();
    }
    qr(t) {
        this.zr.push(t);
    }
    shutdown() {
        window.removeEventListener("online", this.Ur), window.removeEventListener("offline", this.Gr);
    }
    jr() {
        window.addEventListener("online", this.Ur), window.addEventListener("offline", this.Gr);
    }
    Kr() {
        C("ConnectivityMonitor", "Network connectivity changed: AVAILABLE");
        for (const t of this.zr) t(0 /* NetworkStatus.AVAILABLE */);
    }
    Qr() {
        C("ConnectivityMonitor", "Network connectivity changed: UNAVAILABLE");
        for (const t of this.zr) t(1 /* NetworkStatus.UNAVAILABLE */);
    }
    // TODO(chenbrian): Consider passing in window either into this component or
    // here for testing via FakeWindow.
    /** Checks that all used attributes of window are available. */
    static D() {
        return "undefined" != typeof window && void 0 !== window.addEventListener && void 0 !== window.removeEventListener;
    }
}

/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * The value returned from the most recent invocation of
 * `generateUniqueDebugId()`, or null if it has never been invoked.
 */ let Iu = null;

/**
 * Generates and returns an initial value for `lastUniqueDebugId`.
 *
 * The returned value is randomly selected from a range of integers that are
 * represented as 8 hexadecimal digits. This means that (within reason) any
 * numbers generated by incrementing the returned number by 1 will also be
 * represented by 8 hexadecimal digits. This leads to all "IDs" having the same
 * length when converted to a hexadecimal string, making reading logs containing
 * these IDs easier to follow. And since the return value is randomly selected
 * it will help to differentiate between logs from different executions.
 */
/**
 * Generates and returns a unique ID as a hexadecimal string.
 *
 * The returned ID is intended to be used in debug logging messages to help
 * correlate log messages that may be spatially separated in the logs, but
 * logically related. For example, a network connection could include the same
 * "debug ID" string in all of its log messages to help trace a specific
 * connection over time.
 *
 * @return the 10-character generated ID (e.g. "0xa1b2c3d4").
 */
function Tu() {
    return null === Iu ? Iu = 268435456 + Math.round(2147483648 * Math.random()) : Iu++, 
    "0x" + Iu.toString(16);
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Eu = {
    BatchGetDocuments: "batchGet",
    Commit: "commit",
    RunQuery: "runQuery",
    RunAggregationQuery: "runAggregationQuery"
};

/**
 * Maps RPC names to the corresponding REST endpoint name.
 *
 * We use array notation to avoid mangling.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Provides a simple helper class that implements the Stream interface to
 * bridge to other implementations that are streams but do not implement the
 * interface. The stream callbacks are invoked with the callOn... methods.
 */
class Au {
    constructor(t) {
        this.Wr = t.Wr, this.Hr = t.Hr;
    }
    Jr(t) {
        this.Yr = t;
    }
    Zr(t) {
        this.Xr = t;
    }
    onMessage(t) {
        this.eo = t;
    }
    close() {
        this.Hr();
    }
    send(t) {
        this.Wr(t);
    }
    no() {
        this.Yr();
    }
    so(t) {
        this.Xr(t);
    }
    io(t) {
        this.eo(t);
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Ru = "WebChannelConnection";

class vu extends 
/**
 * Base class for all Rest-based connections to the backend (WebChannel and
 * HTTP).
 */
class {
    constructor(t) {
        this.databaseInfo = t, this.databaseId = t.databaseId;
        const e = t.ssl ? "https" : "http";
        this.ro = e + "://" + t.host, this.oo = "projects/" + this.databaseId.projectId + "/databases/" + this.databaseId.database + "/documents";
    }
    get uo() {
        // Both `invokeRPC()` and `invokeStreamingRPC()` use their `path` arguments to determine
        // where to run the query, and expect the `request` to NOT specify the "path".
        return !1;
    }
    co(t, e, n, s, i) {
        const r = Tu(), o = this.ao(t, e);
        C("RestConnection", `Sending RPC '${t}' ${r}:`, o, n);
        const u = {};
        return this.ho(u, s, i), this.lo(t, o, u, n).then((e => (C("RestConnection", `Received RPC '${t}' ${r}: `, e), 
        e)), (e => {
            throw N("RestConnection", `RPC '${t}' ${r} failed with error: `, e, "url: ", o, "request:", n), 
            e;
        }));
    }
    fo(t, e, n, s, i, r) {
        // The REST API automatically aggregates all of the streamed results, so we
        // can just use the normal invoke() method.
        return this.co(t, e, n, s, i);
    }
    /**
     * Modifies the headers for a request, adding any authorization token if
     * present and any additional headers for the request.
     */    ho(t, e, n) {
        t["X-Goog-Api-Client"] = "gl-js/ fire/" + P, 
        // Content-Type: text/plain will avoid preflight requests which might
        // mess with CORS and redirects by proxies. If we add custom headers
        // we will need to change this code to potentially use the $httpOverwrite
        // parameter supported by ESF to avoid triggering preflight requests.
        t["Content-Type"] = "text/plain", this.databaseInfo.appId && (t["X-Firebase-GMPID"] = this.databaseInfo.appId), 
        e && e.headers.forEach(((e, n) => t[n] = e)), n && n.headers.forEach(((e, n) => t[n] = e));
    }
    ao(t, e) {
        const n = Eu[t];
        return `${this.ro}/v1/${e}:${n}`;
    }
} {
    constructor(t) {
        super(t), this.forceLongPolling = t.forceLongPolling, this.autoDetectLongPolling = t.autoDetectLongPolling, 
        this.useFetchStreams = t.useFetchStreams;
    }
    lo(t, e, n, s) {
        const i = Tu();
        return new Promise(((r, o) => {
            const u = new XhrIo;
            u.setWithCredentials(!0), u.listenOnce(EventType.COMPLETE, (() => {
                try {
                    switch (u.getLastErrorCode()) {
                      case ErrorCode.NO_ERROR:
                        const e = u.getResponseJson();
                        C(Ru, `XHR for RPC '${t}' ${i} received:`, JSON.stringify(e)), r(e);
                        break;

                      case ErrorCode.TIMEOUT:
                        C(Ru, `RPC '${t}' ${i} timed out`), o(new L(B.DEADLINE_EXCEEDED, "Request time out"));
                        break;

                      case ErrorCode.HTTP_ERROR:
                        const n = u.getStatus();
                        if (C(Ru, `RPC '${t}' ${i} failed with status:`, n, "response text:", u.getResponseText()), 
                        n > 0) {
                            let t = u.getResponseJson();
                            Array.isArray(t) && (t = t[0]);
                            const e = null == t ? void 0 : t.error;
                            if (e && e.status && e.message) {
                                const t = function(t) {
                                    const e = t.toLowerCase().replace(/_/g, "-");
                                    return Object.values(B).indexOf(e) >= 0 ? e : B.UNKNOWN;
                                }(e.status);
                                o(new L(t, e.message));
                            } else o(new L(B.UNKNOWN, "Server responded with status " + u.getStatus()));
                        } else 
                        // If we received an HTTP_ERROR but there's no status code,
                        // it's most probably a connection issue
                        o(new L(B.UNAVAILABLE, "Connection failed."));
                        break;

                      default:
                        O();
                    }
                } finally {
                    C(Ru, `RPC '${t}' ${i} completed.`);
                }
            }));
            const c = JSON.stringify(s);
            C(Ru, `RPC '${t}' ${i} sending request:`, s), u.send(e, "POST", c, n, 15);
        }));
    }
    wo(t, e, n) {
        const s = Tu(), i = [ this.ro, "/", "google.firestore.v1.Firestore", "/", t, "/channel" ], r = createWebChannelTransport(), o = getStatEventTarget(), u = {
            // Required for backend stickiness, routing behavior is based on this
            // parameter.
            httpSessionIdParam: "gsessionid",
            initMessageHeaders: {},
            messageUrlParams: {
                // This param is used to improve routing and project isolation by the
                // backend and must be included in every request.
                database: `projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`
            },
            sendRawJson: !0,
            supportsCrossDomainXhr: !0,
            internalChannelParams: {
                // Override the default timeout (randomized between 10-20 seconds) since
                // a large write batch on a slow internet connection may take a long
                // time to send to the backend. Rather than have WebChannel impose a
                // tight timeout which could lead to infinite timeouts and retries, we
                // set it very large (5-10 minutes) and rely on the browser's builtin
                // timeouts to kick in if the request isn't working.
                forwardChannelRequestTimeoutMs: 6e5
            },
            forceLongPolling: this.forceLongPolling,
            detectBufferingProxy: this.autoDetectLongPolling
        };
        this.useFetchStreams && (u.xmlHttpFactory = new FetchXmlHttpFactory({})), this.ho(u.initMessageHeaders, e, n), 
        // Sending the custom headers we just added to request.initMessageHeaders
        // (Authorization, etc.) will trigger the browser to make a CORS preflight
        // request because the XHR will no longer meet the criteria for a "simple"
        // CORS request:
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Simple_requests
        // Therefore to avoid the CORS preflight request (an extra network
        // roundtrip), we use the encodeInitMessageHeaders option to specify that
        // the headers should instead be encoded in the request's POST payload,
        // which is recognized by the webchannel backend.
        u.encodeInitMessageHeaders = !0;
        const c = i.join("");
        C(Ru, `Creating RPC '${t}' stream ${s}: ${c}`, u);
        const a = r.createWebChannel(c, u);
        // WebChannel supports sending the first message with the handshake - saving
        // a network round trip. However, it will have to call send in the same
        // JS event loop as open. In order to enforce this, we delay actually
        // opening the WebChannel until send is called. Whether we have called
        // open is tracked with this variable.
                let h = !1, l = !1;
        // A flag to determine whether the stream was closed (by us or through an
        // error/close event) to avoid delivering multiple close events or sending
        // on a closed stream
                const f = new Au({
            Wr: e => {
                l ? C(Ru, `Not sending because RPC '${t}' stream ${s} is closed:`, e) : (h || (C(Ru, `Opening RPC '${t}' stream ${s} transport.`), 
                a.open(), h = !0), C(Ru, `RPC '${t}' stream ${s} sending:`, e), a.send(e));
            },
            Hr: () => a.close()
        }), d = (t, e, n) => {
            // TODO(dimond): closure typing seems broken because WebChannel does
            // not implement goog.events.Listenable
            t.listen(e, (t => {
                try {
                    n(t);
                } catch (t) {
                    setTimeout((() => {
                        throw t;
                    }), 0);
                }
            }));
        };
        // Closure events are guarded and exceptions are swallowed, so catch any
        // exception and rethrow using a setTimeout so they become visible again.
        // Note that eventually this function could go away if we are confident
        // enough the code is exception free.
                return d(a, WebChannel.EventType.OPEN, (() => {
            l || C(Ru, `RPC '${t}' stream ${s} transport opened.`);
        })), d(a, WebChannel.EventType.CLOSE, (() => {
            l || (l = !0, C(Ru, `RPC '${t}' stream ${s} transport closed`), f.so());
        })), d(a, WebChannel.EventType.ERROR, (e => {
            l || (l = !0, N(Ru, `RPC '${t}' stream ${s} transport errored:`, e), f.so(new L(B.UNAVAILABLE, "The operation could not be completed")));
        })), d(a, WebChannel.EventType.MESSAGE, (e => {
            var n;
            if (!l) {
                const i = e.data[0];
                $(!!i);
                // TODO(b/35143891): There is a bug in One Platform that caused errors
                // (and only errors) to be wrapped in an extra array. To be forward
                // compatible with the bug we need to check either condition. The latter
                // can be removed once the fix has been rolled out.
                // Use any because msgData.error is not typed.
                const r = i, o = r.error || (null === (n = r[0]) || void 0 === n ? void 0 : n.error);
                if (o) {
                    C(Ru, `RPC '${t}' stream ${s} received error:`, o);
                    // error.status will be a string like 'OK' or 'NOT_FOUND'.
                    const e = o.status;
                    let n = 
                    /**
 * Maps an error Code from a GRPC status identifier like 'NOT_FOUND'.
 *
 * @returns The Code equivalent to the given status string or undefined if
 *     there is no match.
 */
                    function(t) {
                        // lookup by string
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const e = si[t];
                        if (void 0 !== e) return oi(e);
                    }(e), i = o.message;
                    void 0 === n && (n = B.INTERNAL, i = "Unknown error status: " + e + " with message " + o.message), 
                    // Mark closed so no further events are propagated
                    l = !0, f.so(new L(n, i)), a.close();
                } else C(Ru, `RPC '${t}' stream ${s} received:`, i), f.io(i);
            }
        })), d(o, Event.STAT_EVENT, (e => {
            e.stat === Stat.PROXY ? C(Ru, `RPC '${t}' stream ${s} detected buffering proxy`) : e.stat === Stat.NOPROXY && C(Ru, `RPC '${t}' stream ${s} detected no buffering proxy`);
        })), setTimeout((() => {
            // Technically we could/should wait for the WebChannel opened event,
            // but because we want to send the first message with the WebChannel
            // handshake we pretend the channel opened here (asynchronously), and
            // then delay the actual open until the first message is sent.
            f.no();
        }), 0), f;
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** Initializes the WebChannelConnection for the browser. */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** The Platform's 'window' implementation or null if not available. */
function bu() {
    // `window` is not always available, e.g. in ReactNative and WebWorkers.
    // eslint-disable-next-line no-restricted-globals
    return "undefined" != typeof window ? window : null;
}

/** The Platform's 'document' implementation or null if not available. */ function Pu() {
    // `document` is not always available, e.g. in ReactNative and WebWorkers.
    // eslint-disable-next-line no-restricted-globals
    return "undefined" != typeof document ? document : null;
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Vu(t) {
    return new Ti(t, /* useProto3Json= */ !0);
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A helper for running delayed tasks following an exponential backoff curve
 * between attempts.
 *
 * Each delay is made up of a "base" delay which follows the exponential
 * backoff curve, and a +/- 50% "jitter" that is calculated and added to the
 * base delay. This prevents clients from accidentally synchronizing their
 * delays causing spikes of load to the backend.
 */
class Su {
    constructor(
    /**
     * The AsyncQueue to run backoff operations on.
     */
    t, 
    /**
     * The ID to use when scheduling backoff operations on the AsyncQueue.
     */
    e, 
    /**
     * The initial delay (used as the base delay on the first retry attempt).
     * Note that jitter will still be applied, so the actual delay could be as
     * little as 0.5*initialDelayMs.
     */
    n = 1e3
    /**
     * The multiplier to use to determine the extended base delay after each
     * attempt.
     */ , s = 1.5
    /**
     * The maximum base delay after which no further backoff is performed.
     * Note that jitter will still be applied, so the actual delay could be as
     * much as 1.5*maxDelayMs.
     */ , i = 6e4) {
        this.Ws = t, this.timerId = e, this._o = n, this.mo = s, this.yo = i, this.po = 0, 
        this.Io = null, 
        /** The last backoff attempt, as epoch milliseconds. */
        this.To = Date.now(), this.reset();
    }
    /**
     * Resets the backoff delay.
     *
     * The very next backoffAndWait() will have no delay. If it is called again
     * (i.e. due to an error), initialDelayMs (plus jitter) will be used, and
     * subsequent ones will increase according to the backoffFactor.
     */    reset() {
        this.po = 0;
    }
    /**
     * Resets the backoff delay to the maximum delay (e.g. for use after a
     * RESOURCE_EXHAUSTED error).
     */    Eo() {
        this.po = this.yo;
    }
    /**
     * Returns a promise that resolves after currentDelayMs, and increases the
     * delay for any subsequent attempts. If there was a pending backoff operation
     * already, it will be canceled.
     */    Ao(t) {
        // Cancel any pending backoff operation.
        this.cancel();
        // First schedule using the current base (which may be 0 and should be
        // honored as such).
        const e = Math.floor(this.po + this.Ro()), n = Math.max(0, Date.now() - this.To), s = Math.max(0, e - n);
        // Guard against lastAttemptTime being in the future due to a clock change.
                s > 0 && C("ExponentialBackoff", `Backing off for ${s} ms (base delay: ${this.po} ms, delay with jitter: ${e} ms, last attempt: ${n} ms ago)`), 
        this.Io = this.Ws.enqueueAfterDelay(this.timerId, s, (() => (this.To = Date.now(), 
        t()))), 
        // Apply backoff factor to determine next delay and ensure it is within
        // bounds.
        this.po *= this.mo, this.po < this._o && (this.po = this._o), this.po > this.yo && (this.po = this.yo);
    }
    vo() {
        null !== this.Io && (this.Io.skipDelay(), this.Io = null);
    }
    cancel() {
        null !== this.Io && (this.Io.cancel(), this.Io = null);
    }
    /** Returns a random value in the range [-currentBaseMs/2, currentBaseMs/2] */    Ro() {
        return (Math.random() - .5) * this.po;
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A PersistentStream is an abstract base class that represents a streaming RPC
 * to the Firestore backend. It's built on top of the connections own support
 * for streaming RPCs, and adds several critical features for our clients:
 *
 *   - Exponential backoff on failure
 *   - Authentication via CredentialsProvider
 *   - Dispatching all callbacks into the shared worker queue
 *   - Closing idle streams after 60 seconds of inactivity
 *
 * Subclasses of PersistentStream implement serialization of models to and
 * from the JSON representation of the protocol buffers for a specific
 * streaming RPC.
 *
 * ## Starting and Stopping
 *
 * Streaming RPCs are stateful and need to be start()ed before messages can
 * be sent and received. The PersistentStream will call the onOpen() function
 * of the listener once the stream is ready to accept requests.
 *
 * Should a start() fail, PersistentStream will call the registered onClose()
 * listener with a FirestoreError indicating what went wrong.
 *
 * A PersistentStream can be started and stopped repeatedly.
 *
 * Generic types:
 *  SendType: The type of the outgoing message of the underlying
 *    connection stream
 *  ReceiveType: The type of the incoming message of the underlying
 *    connection stream
 *  ListenerType: The type of the listener that will be used for callbacks
 */
class Du {
    constructor(t, e, n, s, i, r, o, u) {
        this.Ws = t, this.bo = n, this.Po = s, this.connection = i, this.authCredentialsProvider = r, 
        this.appCheckCredentialsProvider = o, this.listener = u, this.state = 0 /* PersistentStreamState.Initial */ , 
        /**
         * A close count that's incremented every time the stream is closed; used by
         * getCloseGuardedDispatcher() to invalidate callbacks that happen after
         * close.
         */
        this.Vo = 0, this.So = null, this.Do = null, this.stream = null, this.Co = new Su(t, e);
    }
    /**
     * Returns true if start() has been called and no error has occurred. True
     * indicates the stream is open or in the process of opening (which
     * encompasses respecting backoff, getting auth tokens, and starting the
     * actual RPC). Use isOpen() to determine if the stream is open and ready for
     * outbound requests.
     */    xo() {
        return 1 /* PersistentStreamState.Starting */ === this.state || 5 /* PersistentStreamState.Backoff */ === this.state || this.No();
    }
    /**
     * Returns true if the underlying RPC is open (the onOpen() listener has been
     * called) and the stream is ready for outbound requests.
     */    No() {
        return 2 /* PersistentStreamState.Open */ === this.state || 3 /* PersistentStreamState.Healthy */ === this.state;
    }
    /**
     * Starts the RPC. Only allowed if isStarted() returns false. The stream is
     * not immediately ready for use: onOpen() will be invoked when the RPC is
     * ready for outbound requests, at which point isOpen() will return true.
     *
     * When start returns, isStarted() will return true.
     */    start() {
        4 /* PersistentStreamState.Error */ !== this.state ? this.auth() : this.ko();
    }
    /**
     * Stops the RPC. This call is idempotent and allowed regardless of the
     * current isStarted() state.
     *
     * When stop returns, isStarted() and isOpen() will both return false.
     */    async stop() {
        this.xo() && await this.close(0 /* PersistentStreamState.Initial */);
    }
    /**
     * After an error the stream will usually back off on the next attempt to
     * start it. If the error warrants an immediate restart of the stream, the
     * sender can use this to indicate that the receiver should not back off.
     *
     * Each error will call the onClose() listener. That function can decide to
     * inhibit backoff if required.
     */    Oo() {
        this.state = 0 /* PersistentStreamState.Initial */ , this.Co.reset();
    }
    /**
     * Marks this stream as idle. If no further actions are performed on the
     * stream for one minute, the stream will automatically close itself and
     * notify the stream's onClose() handler with Status.OK. The stream will then
     * be in a !isStarted() state, requiring the caller to start the stream again
     * before further use.
     *
     * Only streams that are in state 'Open' can be marked idle, as all other
     * states imply pending network operations.
     */    $o() {
        // Starts the idle time if we are in state 'Open' and are not yet already
        // running a timer (in which case the previous idle timeout still applies).
        this.No() && null === this.So && (this.So = this.Ws.enqueueAfterDelay(this.bo, 6e4, (() => this.Mo())));
    }
    /** Sends a message to the underlying stream. */    Fo(t) {
        this.Bo(), this.stream.send(t);
    }
    /** Called by the idle timer when the stream should close due to inactivity. */    async Mo() {
        if (this.No()) 
        // When timing out an idle stream there's no reason to force the stream into backoff when
        // it restarts so set the stream state to Initial instead of Error.
        return this.close(0 /* PersistentStreamState.Initial */);
    }
    /** Marks the stream as active again. */    Bo() {
        this.So && (this.So.cancel(), this.So = null);
    }
    /** Cancels the health check delayed operation. */    Lo() {
        this.Do && (this.Do.cancel(), this.Do = null);
    }
    /**
     * Closes the stream and cleans up as necessary:
     *
     * * closes the underlying GRPC stream;
     * * calls the onClose handler with the given 'error';
     * * sets internal stream state to 'finalState';
     * * adjusts the backoff timer based on the error
     *
     * A new stream can be opened by calling start().
     *
     * @param finalState - the intended state of the stream after closing.
     * @param error - the error the connection was closed with.
     */    async close(t, e) {
        // Cancel any outstanding timers (they're guaranteed not to execute).
        this.Bo(), this.Lo(), this.Co.cancel(), 
        // Invalidates any stream-related callbacks (e.g. from auth or the
        // underlying stream), guaranteeing they won't execute.
        this.Vo++, 4 /* PersistentStreamState.Error */ !== t ? 
        // If this is an intentional close ensure we don't delay our next connection attempt.
        this.Co.reset() : e && e.code === B.RESOURCE_EXHAUSTED ? (
        // Log the error. (Probably either 'quota exceeded' or 'max queue length reached'.)
        x(e.toString()), x("Using maximum backoff delay to prevent overloading the backend."), 
        this.Co.Eo()) : e && e.code === B.UNAUTHENTICATED && 3 /* PersistentStreamState.Healthy */ !== this.state && (
        // "unauthenticated" error means the token was rejected. This should rarely
        // happen since both Auth and AppCheck ensure a sufficient TTL when we
        // request a token. If a user manually resets their system clock this can
        // fail, however. In this case, we should get a Code.UNAUTHENTICATED error
        // before we received the first message and we need to invalidate the token
        // to ensure that we fetch a new token.
        this.authCredentialsProvider.invalidateToken(), this.appCheckCredentialsProvider.invalidateToken()), 
        // Clean up the underlying stream because we are no longer interested in events.
        null !== this.stream && (this.qo(), this.stream.close(), this.stream = null), 
        // This state must be assigned before calling onClose() to allow the callback to
        // inhibit backoff or otherwise manipulate the state in its non-started state.
        this.state = t, 
        // Notify the listener that the stream closed.
        await this.listener.Zr(e);
    }
    /**
     * Can be overridden to perform additional cleanup before the stream is closed.
     * Calling super.tearDown() is not required.
     */    qo() {}
    auth() {
        this.state = 1 /* PersistentStreamState.Starting */;
        const t = this.Uo(this.Vo), e = this.Vo;
        // TODO(mikelehen): Just use dispatchIfNotClosed, but see TODO below.
                Promise.all([ this.authCredentialsProvider.getToken(), this.appCheckCredentialsProvider.getToken() ]).then((([t, n]) => {
            // Stream can be stopped while waiting for authentication.
            // TODO(mikelehen): We really should just use dispatchIfNotClosed
            // and let this dispatch onto the queue, but that opened a spec test can
            // of worms that I don't want to deal with in this PR.
            this.Vo === e && 
            // Normally we'd have to schedule the callback on the AsyncQueue.
            // However, the following calls are safe to be called outside the
            // AsyncQueue since they don't chain asynchronous calls
            this.Ko(t, n);
        }), (e => {
            t((() => {
                const t = new L(B.UNKNOWN, "Fetching auth token failed: " + e.message);
                return this.Go(t);
            }));
        }));
    }
    Ko(t, e) {
        const n = this.Uo(this.Vo);
        this.stream = this.Qo(t, e), this.stream.Jr((() => {
            n((() => (this.state = 2 /* PersistentStreamState.Open */ , this.Do = this.Ws.enqueueAfterDelay(this.Po, 1e4, (() => (this.No() && (this.state = 3 /* PersistentStreamState.Healthy */), 
            Promise.resolve()))), this.listener.Jr())));
        })), this.stream.Zr((t => {
            n((() => this.Go(t)));
        })), this.stream.onMessage((t => {
            n((() => this.onMessage(t)));
        }));
    }
    ko() {
        this.state = 5 /* PersistentStreamState.Backoff */ , this.Co.Ao((async () => {
            this.state = 0 /* PersistentStreamState.Initial */ , this.start();
        }));
    }
    // Visible for tests
    Go(t) {
        // In theory the stream could close cleanly, however, in our current model
        // we never expect this to happen because if we stop a stream ourselves,
        // this callback will never be called. To prevent cases where we retry
        // without a backoff accidentally, we set the stream to error in all cases.
        return C("PersistentStream", `close with error: ${t}`), this.stream = null, this.close(4 /* PersistentStreamState.Error */ , t);
    }
    /**
     * Returns a "dispatcher" function that dispatches operations onto the
     * AsyncQueue but only runs them if closeCount remains unchanged. This allows
     * us to turn auth / stream callbacks into no-ops if the stream is closed /
     * re-opened, etc.
     */    Uo(t) {
        return e => {
            this.Ws.enqueueAndForget((() => this.Vo === t ? e() : (C("PersistentStream", "stream callback skipped by getCloseGuardedDispatcher."), 
            Promise.resolve())));
        };
    }
}

/**
 * A PersistentStream that implements the Listen RPC.
 *
 * Once the Listen stream has called the onOpen() listener, any number of
 * listen() and unlisten() calls can be made to control what changes will be
 * sent from the server for ListenResponses.
 */ class Cu extends Du {
    constructor(t, e, n, s, i, r) {
        super(t, "listen_stream_connection_backoff" /* TimerId.ListenStreamConnectionBackoff */ , "listen_stream_idle" /* TimerId.ListenStreamIdle */ , "health_check_timeout" /* TimerId.HealthCheckTimeout */ , e, n, s, r), 
        this.serializer = i;
    }
    Qo(t, e) {
        return this.connection.wo("Listen", t, e);
    }
    onMessage(t) {
        // A successful response means the stream is healthy
        this.Co.reset();
        const e = Mi(this.serializer, t), n = function(t) {
            // We have only reached a consistent snapshot for the entire stream if there
            // is a read_time set and it applies to all targets (i.e. the list of
            // targets is empty). The backend is guaranteed to send such responses.
            if (!("targetChange" in t)) return st.min();
            const e = t.targetChange;
            return e.targetIds && e.targetIds.length ? st.min() : e.readTime ? vi(e.readTime) : st.min();
        }(t);
        return this.listener.zo(e, n);
    }
    /**
     * Registers interest in the results of the given target. If the target
     * includes a resumeToken it will be included in the request. Results that
     * affect the target will be streamed back as WatchChange messages that
     * reference the targetId.
     */    jo(t) {
        const e = {};
        e.database = xi(this.serializer), e.addTarget = function(t, e) {
            let n;
            const s = e.target;
            return n = On(s) ? {
                documents: qi(t, s)
            } : {
                query: Ui(t, s)
            }, n.targetId = e.targetId, e.resumeToken.approximateByteSize() > 0 ? n.resumeToken = Ai(t, e.resumeToken) : e.snapshotVersion.compareTo(st.min()) > 0 && (
            // TODO(wuandy): Consider removing above check because it is most likely true.
            // Right now, many tests depend on this behaviour though (leaving min() out
            // of serialization).
            n.readTime = Ei(t, e.snapshotVersion.toTimestamp())), n;
        }(this.serializer, t);
        const n = Gi(this.serializer, t);
        n && (e.labels = n), this.Fo(e);
    }
    /**
     * Unregisters interest in the results of the target associated with the
     * given targetId.
     */    Wo(t) {
        const e = {};
        e.database = xi(this.serializer), e.removeTarget = t, this.Fo(e);
    }
}

/**
 * A Stream that implements the Write RPC.
 *
 * The Write RPC requires the caller to maintain special streamToken
 * state in between calls, to help the server understand which responses the
 * client has processed by the time the next request is made. Every response
 * will contain a streamToken; this value must be passed to the next
 * request.
 *
 * After calling start() on this stream, the next request must be a handshake,
 * containing whatever streamToken is on hand. Once a response to this
 * request is received, all pending mutations may be submitted. When
 * submitting multiple batches of mutations at the same time, it's
 * okay to use the same streamToken for the calls to writeMutations.
 *
 * TODO(b/33271235): Use proto types
 */ class xu extends Du {
    constructor(t, e, n, s, i, r) {
        super(t, "write_stream_connection_backoff" /* TimerId.WriteStreamConnectionBackoff */ , "write_stream_idle" /* TimerId.WriteStreamIdle */ , "health_check_timeout" /* TimerId.HealthCheckTimeout */ , e, n, s, r), 
        this.serializer = i, this.Ho = !1;
    }
    /**
     * Tracks whether or not a handshake has been successfully exchanged and
     * the stream is ready to accept mutations.
     */    get Jo() {
        return this.Ho;
    }
    // Override of PersistentStream.start
    start() {
        this.Ho = !1, this.lastStreamToken = void 0, super.start();
    }
    qo() {
        this.Ho && this.Yo([]);
    }
    Qo(t, e) {
        return this.connection.wo("Write", t, e);
    }
    onMessage(t) {
        if (
        // Always capture the last stream token.
        $(!!t.streamToken), this.lastStreamToken = t.streamToken, this.Ho) {
            // A successful first write response means the stream is healthy,
            // Note, that we could consider a successful handshake healthy, however,
            // the write itself might be causing an error we want to back off from.
            this.Co.reset();
            const e = Li(t.writeResults, t.commitTime), n = vi(t.commitTime);
            return this.listener.Zo(n, e);
        }
        // The first response is always the handshake response
        return $(!t.writeResults || 0 === t.writeResults.length), this.Ho = !0, this.listener.Xo();
    }
    /**
     * Sends an initial streamToken to the server, performing the handshake
     * required to make the StreamingWrite RPC work. Subsequent
     * calls should wait until onHandshakeComplete was called.
     */    tu() {
        // TODO(dimond): Support stream resumption. We intentionally do not set the
        // stream token on the handshake, ignoring any stream token we might have.
        const t = {};
        t.database = xi(this.serializer), this.Fo(t);
    }
    /** Sends a group of mutations to the Firestore backend to apply. */    Yo(t) {
        const e = {
            streamToken: this.lastStreamToken,
            writes: t.map((t => Fi(this.serializer, t)))
        };
        this.Fo(e);
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Datastore and its related methods are a wrapper around the external Google
 * Cloud Datastore grpc API, which provides an interface that is more convenient
 * for the rest of the client SDK architecture to consume.
 */
/**
 * An implementation of Datastore that exposes additional state for internal
 * consumption.
 */
class Nu extends class {} {
    constructor(t, e, n, s) {
        super(), this.authCredentials = t, this.appCheckCredentials = e, this.connection = n, 
        this.serializer = s, this.eu = !1;
    }
    nu() {
        if (this.eu) throw new L(B.FAILED_PRECONDITION, "The client has already been terminated.");
    }
    /** Invokes the provided RPC with auth and AppCheck tokens. */    co(t, e, n) {
        return this.nu(), Promise.all([ this.authCredentials.getToken(), this.appCheckCredentials.getToken() ]).then((([s, i]) => this.connection.co(t, e, n, s, i))).catch((t => {
            throw "FirebaseError" === t.name ? (t.code === B.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), 
            this.appCheckCredentials.invalidateToken()), t) : new L(B.UNKNOWN, t.toString());
        }));
    }
    /** Invokes the provided RPC with streamed results with auth and AppCheck tokens. */    fo(t, e, n, s) {
        return this.nu(), Promise.all([ this.authCredentials.getToken(), this.appCheckCredentials.getToken() ]).then((([i, r]) => this.connection.fo(t, e, n, i, r, s))).catch((t => {
            throw "FirebaseError" === t.name ? (t.code === B.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), 
            this.appCheckCredentials.invalidateToken()), t) : new L(B.UNKNOWN, t.toString());
        }));
    }
    terminate() {
        this.eu = !0;
    }
}

// TODO(firestorexp): Make sure there is only one Datastore instance per
// firestore-exp client.
async function ku(t, e, n) {
    const s = F(t), i = function(t, e, n) {
        const s = Ui(t, e), i = [];
        return n.forEach((t => {
            "count" === t.yt ? i.push({
                alias: t.alias.canonicalString(),
                count: {}
            }) : "avg" === t.yt ? i.push({
                alias: t.alias.canonicalString(),
                avg: {
                    field: Hi(t.fieldPath)
                }
            }) : "sum" === t.yt && i.push({
                alias: t.alias.canonicalString(),
                sum: {
                    field: Hi(t.fieldPath)
                }
            });
        })), {
            structuredAggregationQuery: {
                aggregations: i,
                structuredQuery: s.structuredQuery
            },
            parent: s.parent
        };
    }(s.serializer, jn(e), n), r = i.parent;
    s.connection.uo || delete i.parent;
    const o = (await s.fo("RunAggregationQuery", r, i, /*expectedResponseCount=*/ 1)).filter((t => !!t.result));
    // Omit RunAggregationQueryResponse that only contain readTimes.
        return $(1 === o.length), (u = o[0]).result, u.result.aggregateFields, new sn({
        mapValue: {
            fields: null === (c = u.result) || void 0 === c ? void 0 : c.aggregateFields
        }
    });
    var u, c;
}

/**
 * A component used by the RemoteStore to track the OnlineState (that is,
 * whether or not the client as a whole should be considered to be online or
 * offline), implementing the appropriate heuristics.
 *
 * In particular, when the client is trying to connect to the backend, we
 * allow up to MAX_WATCH_STREAM_FAILURES within ONLINE_STATE_TIMEOUT_MS for
 * a connection to succeed. If we have too many failures or the timeout elapses,
 * then we set the OnlineState to Offline, and the client will behave as if
 * it is offline (get()s will return cached data, etc.).
 */
class Ou {
    constructor(t, e) {
        this.asyncQueue = t, this.onlineStateHandler = e, 
        /** The current OnlineState. */
        this.state = "Unknown" /* OnlineState.Unknown */ , 
        /**
         * A count of consecutive failures to open the stream. If it reaches the
         * maximum defined by MAX_WATCH_STREAM_FAILURES, we'll set the OnlineState to
         * Offline.
         */
        this.su = 0, 
        /**
         * A timer that elapses after ONLINE_STATE_TIMEOUT_MS, at which point we
         * transition from OnlineState.Unknown to OnlineState.Offline without waiting
         * for the stream to actually fail (MAX_WATCH_STREAM_FAILURES times).
         */
        this.iu = null, 
        /**
         * Whether the client should log a warning message if it fails to connect to
         * the backend (initially true, cleared after a successful stream, or if we've
         * logged the message already).
         */
        this.ru = !0;
    }
    /**
     * Called by RemoteStore when a watch stream is started (including on each
     * backoff attempt).
     *
     * If this is the first attempt, it sets the OnlineState to Unknown and starts
     * the onlineStateTimer.
     */    ou() {
        0 === this.su && (this.uu("Unknown" /* OnlineState.Unknown */), this.iu = this.asyncQueue.enqueueAfterDelay("online_state_timeout" /* TimerId.OnlineStateTimeout */ , 1e4, (() => (this.iu = null, 
        this.cu("Backend didn't respond within 10 seconds."), this.uu("Offline" /* OnlineState.Offline */), 
        Promise.resolve()))));
    }
    /**
     * Updates our OnlineState as appropriate after the watch stream reports a
     * failure. The first failure moves us to the 'Unknown' state. We then may
     * allow multiple failures (based on MAX_WATCH_STREAM_FAILURES) before we
     * actually transition to the 'Offline' state.
     */    au(t) {
        "Online" /* OnlineState.Online */ === this.state ? this.uu("Unknown" /* OnlineState.Unknown */) : (this.su++, 
        this.su >= 1 && (this.hu(), this.cu(`Connection failed 1 times. Most recent error: ${t.toString()}`), 
        this.uu("Offline" /* OnlineState.Offline */)));
    }
    /**
     * Explicitly sets the OnlineState to the specified state.
     *
     * Note that this resets our timers / failure counters, etc. used by our
     * Offline heuristics, so must not be used in place of
     * handleWatchStreamStart() and handleWatchStreamFailure().
     */    set(t) {
        this.hu(), this.su = 0, "Online" /* OnlineState.Online */ === t && (
        // We've connected to watch at least once. Don't warn the developer
        // about being offline going forward.
        this.ru = !1), this.uu(t);
    }
    uu(t) {
        t !== this.state && (this.state = t, this.onlineStateHandler(t));
    }
    cu(t) {
        const e = `Could not reach Cloud Firestore backend. ${t}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
        this.ru ? (x(e), this.ru = !1) : C("OnlineStateTracker", e);
    }
    hu() {
        null !== this.iu && (this.iu.cancel(), this.iu = null);
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class $u {
    constructor(
    /**
     * The local store, used to fill the write pipeline with outbound mutations.
     */
    t, 
    /** The client-side proxy for interacting with the backend. */
    e, n, s, i) {
        this.localStore = t, this.datastore = e, this.asyncQueue = n, this.remoteSyncer = {}, 
        /**
         * A list of up to MAX_PENDING_WRITES writes that we have fetched from the
         * LocalStore via fillWritePipeline() and have or will send to the write
         * stream.
         *
         * Whenever writePipeline.length > 0 the RemoteStore will attempt to start or
         * restart the write stream. When the stream is established the writes in the
         * pipeline will be sent in order.
         *
         * Writes remain in writePipeline until they are acknowledged by the backend
         * and thus will automatically be re-sent if the stream is interrupted /
         * restarted before they're acknowledged.
         *
         * Write responses from the backend are linked to their originating request
         * purely based on order, and so we can just shift() writes from the front of
         * the writePipeline as we receive responses.
         */
        this.lu = [], 
        /**
         * A mapping of watched targets that the client cares about tracking and the
         * user has explicitly called a 'listen' for this target.
         *
         * These targets may or may not have been sent to or acknowledged by the
         * server. On re-establishing the listen stream, these targets should be sent
         * to the server. The targets removed with unlistens are removed eagerly
         * without waiting for confirmation from the listen stream.
         */
        this.fu = new Map, 
        /**
         * A set of reasons for why the RemoteStore may be offline. If empty, the
         * RemoteStore may start its network connections.
         */
        this.du = new Set, 
        /**
         * Event handlers that get called when the network is disabled or enabled.
         *
         * PORTING NOTE: These functions are used on the Web client to create the
         * underlying streams (to support tree-shakeable streams). On Android and iOS,
         * the streams are created during construction of RemoteStore.
         */
        this.wu = [], this._u = i, this._u.qr((t => {
            n.enqueueAndForget((async () => {
                // Porting Note: Unlike iOS, `restartNetwork()` is called even when the
                // network becomes unreachable as we don't have any other way to tear
                // down our streams.
                Qu(this) && (C("RemoteStore", "Restarting streams for network reachability change."), 
                await async function(t) {
                    const e = F(t);
                    e.du.add(4 /* OfflineCause.ConnectivityChange */), await Fu(e), e.mu.set("Unknown" /* OnlineState.Unknown */), 
                    e.du.delete(4 /* OfflineCause.ConnectivityChange */), await Mu(e);
                }(this));
            }));
        })), this.mu = new Ou(n, s);
    }
}

async function Mu(t) {
    if (Qu(t)) for (const e of t.wu) await e(/* enabled= */ !0);
}

/**
 * Temporarily disables the network. The network can be re-enabled using
 * enableNetwork().
 */ async function Fu(t) {
    for (const e of t.wu) await e(/* enabled= */ !1);
}

/**
 * Starts new listen for the given target. Uses resume token if provided. It
 * is a no-op if the target of given `TargetData` is already being listened to.
 */
function Bu(t, e) {
    const n = F(t);
    n.fu.has(e.targetId) || (
    // Mark this as something the client is currently listening for.
    n.fu.set(e.targetId, e), Gu(n) ? 
    // The listen will be sent in onWatchStreamOpen
    Ku(n) : ac(n).No() && qu(n, e));
}

/**
 * Removes the listen from server. It is a no-op if the given target id is
 * not being listened to.
 */ function Lu(t, e) {
    const n = F(t), s = ac(n);
    n.fu.delete(e), s.No() && Uu(n, e), 0 === n.fu.size && (s.No() ? s.$o() : Qu(n) && 
    // Revert to OnlineState.Unknown if the watch stream is not open and we
    // have no listeners, since without any listens to send we cannot
    // confirm if the stream is healthy and upgrade to OnlineState.Online.
    n.mu.set("Unknown" /* OnlineState.Unknown */));
}

/**
 * We need to increment the the expected number of pending responses we're due
 * from watch so we wait for the ack to process any messages from this target.
 */ function qu(t, e) {
    t.gu.Ot(e.targetId), ac(t).jo(e);
}

/**
 * We need to increment the expected number of pending responses we're due
 * from watch so we wait for the removal on the server before we process any
 * messages from this target.
 */ function Uu(t, e) {
    t.gu.Ot(e), ac(t).Wo(e);
}

function Ku(t) {
    t.gu = new _i({
        getRemoteKeysForTarget: e => t.remoteSyncer.getRemoteKeysForTarget(e),
        ne: e => t.fu.get(e) || null
    }), ac(t).start(), t.mu.ou();
}

/**
 * Returns whether the watch stream should be started because it's necessary
 * and has not yet been started.
 */ function Gu(t) {
    return Qu(t) && !ac(t).xo() && t.fu.size > 0;
}

function Qu(t) {
    return 0 === F(t).du.size;
}

function zu(t) {
    t.gu = void 0;
}

async function ju(t) {
    t.fu.forEach(((e, n) => {
        qu(t, e);
    }));
}

async function Wu(t, e) {
    zu(t), 
    // If we still need the watch stream, retry the connection.
    Gu(t) ? (t.mu.au(e), Ku(t)) : 
    // No need to restart watch stream because there are no active targets.
    // The online state is set to unknown because there is no active attempt
    // at establishing a connection
    t.mu.set("Unknown" /* OnlineState.Unknown */);
}

async function Hu(t, e, n) {
    if (
    // Mark the client as online since we got a message from the server
    t.mu.set("Online" /* OnlineState.Online */), e instanceof di && 2 /* WatchTargetChangeState.Removed */ === e.state && e.cause) 
    // There was an error on a target, don't wait for a consistent snapshot
    // to raise events
    try {
        await 
        /** Handles an error on a target */
        async function(t, e) {
            const n = e.cause;
            for (const s of e.targetIds) 
            // A watched target might have been removed already.
            t.fu.has(s) && (await t.remoteSyncer.rejectListen(s, n), t.fu.delete(s), t.gu.removeTarget(s));
        }
        /**
 * Attempts to fill our write pipeline with writes from the LocalStore.
 *
 * Called internally to bootstrap or refill the write pipeline and by
 * SyncEngine whenever there are new mutations to process.
 *
 * Starts the write stream if necessary.
 */ (t, e);
    } catch (n) {
        C("RemoteStore", "Failed to remove targets %s: %s ", e.targetIds.join(","), n), 
        await Ju(t, n);
    } else if (e instanceof li ? t.gu.Kt(e) : e instanceof fi ? t.gu.Jt(e) : t.gu.zt(e), 
    !n.isEqual(st.min())) try {
        const e = await Jo(t.localStore);
        n.compareTo(e) >= 0 && 
        // We have received a target change with a global snapshot if the snapshot
        // version is not equal to SnapshotVersion.min().
        await 
        /**
 * Takes a batch of changes from the Datastore, repackages them as a
 * RemoteEvent, and passes that on to the listener, which is typically the
 * SyncEngine.
 */
        function(t, e) {
            const n = t.gu.Xt(e);
            // Update in-memory resume tokens. LocalStore will update the
            // persistent view of these when applying the completed RemoteEvent.
                        return n.targetChanges.forEach(((n, s) => {
                if (n.resumeToken.approximateByteSize() > 0) {
                    const i = t.fu.get(s);
                    // A watched target might have been removed already.
                                        i && t.fu.set(s, i.withResumeToken(n.resumeToken, e));
                }
            })), 
            // Re-establish listens for the targets that have been invalidated by
            // existence filter mismatches.
            n.targetMismatches.forEach((e => {
                const n = t.fu.get(e);
                if (!n) 
                // A watched target might have been removed already.
                return;
                // Clear the resume token for the target, since we're in a known mismatch
                // state.
                                t.fu.set(e, n.withResumeToken(be.EMPTY_BYTE_STRING, n.snapshotVersion)), 
                // Cause a hard reset by unwatching and rewatching immediately, but
                // deliberately don't send a resume token so that we get a full update.
                Uu(t, e);
                // Mark the target we send as being on behalf of an existence filter
                // mismatch, but don't actually retain that in listenTargets. This ensures
                // that we flag the first re-listen this way without impacting future
                // listens of this target (that might happen e.g. on reconnect).
                const s = new tr(n.target, e, 1 /* TargetPurpose.ExistenceFilterMismatch */ , n.sequenceNumber);
                qu(t, s);
            })), t.remoteSyncer.applyRemoteEvent(n);
        }(t, n);
    } catch (e) {
        C("RemoteStore", "Failed to raise snapshot:", e), await Ju(t, e);
    }
}

/**
 * Recovery logic for IndexedDB errors that takes the network offline until
 * `op` succeeds. Retries are scheduled with backoff using
 * `enqueueRetryable()`. If `op()` is not provided, IndexedDB access is
 * validated via a generic operation.
 *
 * The returned Promise is resolved once the network is disabled and before
 * any retry attempt.
 */ async function Ju(t, e, n) {
    if (!Vt(e)) throw e;
    t.du.add(1 /* OfflineCause.IndexedDbFailed */), 
    // Disable network and raise offline snapshots
    await Fu(t), t.mu.set("Offline" /* OnlineState.Offline */), n || (
    // Use a simple read operation to determine if IndexedDB recovered.
    // Ideally, we would expose a health check directly on SimpleDb, but
    // RemoteStore only has access to persistence through LocalStore.
    n = () => Jo(t.localStore)), 
    // Probe IndexedDB periodically and re-enable network
    t.asyncQueue.enqueueRetryable((async () => {
        C("RemoteStore", "Retrying IndexedDB access"), await n(), t.du.delete(1 /* OfflineCause.IndexedDbFailed */), 
        await Mu(t);
    }));
}

/**
 * Executes `op`. If `op` fails, takes the network offline until `op`
 * succeeds. Returns after the first attempt.
 */ function Yu(t, e) {
    return e().catch((n => Ju(t, n, e)));
}

async function Zu(t) {
    const e = F(t), n = hc(e);
    let s = e.lu.length > 0 ? e.lu[e.lu.length - 1].batchId : -1;
    for (;Xu(e); ) try {
        const t = await Xo(e.localStore, s);
        if (null === t) {
            0 === e.lu.length && n.$o();
            break;
        }
        s = t.batchId, tc(e, t);
    } catch (t) {
        await Ju(e, t);
    }
    ec(e) && nc(e);
}

/**
 * Returns true if we can add to the write pipeline (i.e. the network is
 * enabled and the write pipeline is not full).
 */ function Xu(t) {
    return Qu(t) && t.lu.length < 10;
}

/**
 * Queues additional writes to be sent to the write stream, sending them
 * immediately if the write stream is established.
 */ function tc(t, e) {
    t.lu.push(e);
    const n = hc(t);
    n.No() && n.Jo && n.Yo(e.mutations);
}

function ec(t) {
    return Qu(t) && !hc(t).xo() && t.lu.length > 0;
}

function nc(t) {
    hc(t).start();
}

async function sc(t) {
    hc(t).tu();
}

async function ic(t) {
    const e = hc(t);
    // Send the write pipeline now that the stream is established.
        for (const n of t.lu) e.Yo(n.mutations);
}

async function rc(t, e, n) {
    const s = t.lu.shift(), i = Ys.from(s, e, n);
    await Yu(t, (() => t.remoteSyncer.applySuccessfulWrite(i))), 
    // It's possible that with the completion of this mutation another
    // slot has freed up.
    await Zu(t);
}

async function oc(t, e) {
    // If the write stream closed after the write handshake completes, a write
    // operation failed and we fail the pending operation.
    e && hc(t).Jo && 
    // This error affects the actual write.
    await async function(t, e) {
        // Only handle permanent errors here. If it's transient, just let the retry
        // logic kick in.
        if (n = e.code, ri(n) && n !== B.ABORTED) {
            // This was a permanent error, the request itself was the problem
            // so it's not going to succeed if we resend it.
            const n = t.lu.shift();
            // In this case it's also unlikely that the server itself is melting
            // down -- this was just a bad request so inhibit backoff on the next
            // restart.
                        hc(t).Oo(), await Yu(t, (() => t.remoteSyncer.rejectFailedWrite(n.batchId, e))), 
            // It's possible that with the completion of this mutation
            // another slot has freed up.
            await Zu(t);
        }
        var n;
    }(t, e), 
    // The write stream might have been started by refilling the write
    // pipeline for failed writes
    ec(t) && nc(t);
}

async function uc(t, e) {
    const n = F(t);
    n.asyncQueue.verifyOperationInProgress(), C("RemoteStore", "RemoteStore received new credentials");
    const s = Qu(n);
    // Tear down and re-create our network streams. This will ensure we get a
    // fresh auth token for the new user and re-fill the write pipeline with
    // new mutations from the LocalStore (since mutations are per-user).
        n.du.add(3 /* OfflineCause.CredentialChange */), await Fu(n), s && 
    // Don't set the network status to Unknown if we are offline.
    n.mu.set("Unknown" /* OnlineState.Unknown */), await n.remoteSyncer.handleCredentialChange(e), 
    n.du.delete(3 /* OfflineCause.CredentialChange */), await Mu(n);
}

/**
 * Toggles the network state when the client gains or loses its primary lease.
 */ async function cc(t, e) {
    const n = F(t);
    e ? (n.du.delete(2 /* OfflineCause.IsSecondary */), await Mu(n)) : e || (n.du.add(2 /* OfflineCause.IsSecondary */), 
    await Fu(n), n.mu.set("Unknown" /* OnlineState.Unknown */));
}

/**
 * If not yet initialized, registers the WatchStream and its network state
 * callback with `remoteStoreImpl`. Returns the existing stream if one is
 * already available.
 *
 * PORTING NOTE: On iOS and Android, the WatchStream gets registered on startup.
 * This is not done on Web to allow it to be tree-shaken.
 */ function ac(t) {
    return t.yu || (
    // Create stream (but note that it is not started yet).
    t.yu = function(t, e, n) {
        const s = F(t);
        return s.nu(), new Cu(e, s.connection, s.authCredentials, s.appCheckCredentials, s.serializer, n);
    }
    /**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ (t.datastore, t.asyncQueue, {
        Jr: ju.bind(null, t),
        Zr: Wu.bind(null, t),
        zo: Hu.bind(null, t)
    }), t.wu.push((async e => {
        e ? (t.yu.Oo(), Gu(t) ? Ku(t) : t.mu.set("Unknown" /* OnlineState.Unknown */)) : (await t.yu.stop(), 
        zu(t));
    }))), t.yu;
}

/**
 * If not yet initialized, registers the WriteStream and its network state
 * callback with `remoteStoreImpl`. Returns the existing stream if one is
 * already available.
 *
 * PORTING NOTE: On iOS and Android, the WriteStream gets registered on startup.
 * This is not done on Web to allow it to be tree-shaken.
 */ function hc(t) {
    return t.pu || (
    // Create stream (but note that it is not started yet).
    t.pu = function(t, e, n) {
        const s = F(t);
        return s.nu(), new xu(e, s.connection, s.authCredentials, s.appCheckCredentials, s.serializer, n);
    }(t.datastore, t.asyncQueue, {
        Jr: sc.bind(null, t),
        Zr: oc.bind(null, t),
        Xo: ic.bind(null, t),
        Zo: rc.bind(null, t)
    }), t.wu.push((async e => {
        e ? (t.pu.Oo(), 
        // This will start the write stream if necessary.
        await Zu(t)) : (await t.pu.stop(), t.lu.length > 0 && (C("RemoteStore", `Stopping write stream with ${t.lu.length} pending writes`), 
        t.lu = []));
    }))), t.pu;
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Represents an operation scheduled to be run in the future on an AsyncQueue.
 *
 * It is created via DelayedOperation.createAndSchedule().
 *
 * Supports cancellation (via cancel()) and early execution (via skipDelay()).
 *
 * Note: We implement `PromiseLike` instead of `Promise`, as the `Promise` type
 * in newer versions of TypeScript defines `finally`, which is not available in
 * IE.
 */
class lc {
    constructor(t, e, n, s, i) {
        this.asyncQueue = t, this.timerId = e, this.targetTimeMs = n, this.op = s, this.removalCallback = i, 
        this.deferred = new q, this.then = this.deferred.promise.then.bind(this.deferred.promise), 
        // It's normal for the deferred promise to be canceled (due to cancellation)
        // and so we attach a dummy catch callback to avoid
        // 'UnhandledPromiseRejectionWarning' log spam.
        this.deferred.promise.catch((t => {}));
    }
    /**
     * Creates and returns a DelayedOperation that has been scheduled to be
     * executed on the provided asyncQueue after the provided delayMs.
     *
     * @param asyncQueue - The queue to schedule the operation on.
     * @param id - A Timer ID identifying the type of operation this is.
     * @param delayMs - The delay (ms) before the operation should be scheduled.
     * @param op - The operation to run.
     * @param removalCallback - A callback to be called synchronously once the
     *   operation is executed or canceled, notifying the AsyncQueue to remove it
     *   from its delayedOperations list.
     *   PORTING NOTE: This exists to prevent making removeDelayedOperation() and
     *   the DelayedOperation class public.
     */    static createAndSchedule(t, e, n, s, i) {
        const r = Date.now() + n, o = new lc(t, e, r, s, i);
        return o.start(n), o;
    }
    /**
     * Starts the timer. This is called immediately after construction by
     * createAndSchedule().
     */    start(t) {
        this.timerHandle = setTimeout((() => this.handleDelayElapsed()), t);
    }
    /**
     * Queues the operation to run immediately (if it hasn't already been run or
     * canceled).
     */    skipDelay() {
        return this.handleDelayElapsed();
    }
    /**
     * Cancels the operation if it hasn't already been executed or canceled. The
     * promise will be rejected.
     *
     * As long as the operation has not yet been run, calling cancel() provides a
     * guarantee that the operation will not be run.
     */    cancel(t) {
        null !== this.timerHandle && (this.clearTimeout(), this.deferred.reject(new L(B.CANCELLED, "Operation cancelled" + (t ? ": " + t : ""))));
    }
    handleDelayElapsed() {
        this.asyncQueue.enqueueAndForget((() => null !== this.timerHandle ? (this.clearTimeout(), 
        this.op().then((t => this.deferred.resolve(t)))) : Promise.resolve()));
    }
    clearTimeout() {
        null !== this.timerHandle && (this.removalCallback(this), clearTimeout(this.timerHandle), 
        this.timerHandle = null);
    }
}

/**
 * Returns a FirestoreError that can be surfaced to the user if the provided
 * error is an IndexedDbTransactionError. Re-throws the error otherwise.
 */ function fc(t, e) {
    if (x("AsyncQueue", `${e}: ${t}`), Vt(t)) return new L(B.UNAVAILABLE, `${e}: ${t}`);
    throw t;
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * DocumentSet is an immutable (copy-on-write) collection that holds documents
 * in order specified by the provided comparator. We always add a document key
 * comparator on top of what is provided to guarantee document equality based on
 * the key.
 */ class dc {
    /** The default ordering is by key if the comparator is omitted */
    constructor(t) {
        // We are adding document key comparator to the end as it's the only
        // guaranteed unique property of a document.
        this.comparator = t ? (e, n) => t(e, n) || ct.comparator(e.key, n.key) : (t, e) => ct.comparator(t.key, e.key), 
        this.keyedMap = us(), this.sortedSet = new ge(this.comparator);
    }
    /**
     * Returns an empty copy of the existing DocumentSet, using the same
     * comparator.
     */    static emptySet(t) {
        return new dc(t.comparator);
    }
    has(t) {
        return null != this.keyedMap.get(t);
    }
    get(t) {
        return this.keyedMap.get(t);
    }
    first() {
        return this.sortedSet.minKey();
    }
    last() {
        return this.sortedSet.maxKey();
    }
    isEmpty() {
        return this.sortedSet.isEmpty();
    }
    /**
     * Returns the index of the provided key in the document set, or -1 if the
     * document key is not present in the set;
     */    indexOf(t) {
        const e = this.keyedMap.get(t);
        return e ? this.sortedSet.indexOf(e) : -1;
    }
    get size() {
        return this.sortedSet.size;
    }
    /** Iterates documents in order defined by "comparator" */    forEach(t) {
        this.sortedSet.inorderTraversal(((e, n) => (t(e), !1)));
    }
    /** Inserts or updates a document with the same key */    add(t) {
        // First remove the element if we have it.
        const e = this.delete(t.key);
        return e.copy(e.keyedMap.insert(t.key, t), e.sortedSet.insert(t, null));
    }
    /** Deletes a document with a given key */    delete(t) {
        const e = this.get(t);
        return e ? this.copy(this.keyedMap.remove(t), this.sortedSet.remove(e)) : this;
    }
    isEqual(t) {
        if (!(t instanceof dc)) return !1;
        if (this.size !== t.size) return !1;
        const e = this.sortedSet.getIterator(), n = t.sortedSet.getIterator();
        for (;e.hasNext(); ) {
            const t = e.getNext().key, s = n.getNext().key;
            if (!t.isEqual(s)) return !1;
        }
        return !0;
    }
    toString() {
        const t = [];
        return this.forEach((e => {
            t.push(e.toString());
        })), 0 === t.length ? "DocumentSet ()" : "DocumentSet (\n  " + t.join("  \n") + "\n)";
    }
    copy(t, e) {
        const n = new dc;
        return n.comparator = this.comparator, n.keyedMap = t, n.sortedSet = e, n;
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * DocumentChangeSet keeps track of a set of changes to docs in a query, merging
 * duplicate events for the same doc.
 */ class wc {
    constructor() {
        this.Iu = new ge(ct.comparator);
    }
    track(t) {
        const e = t.doc.key, n = this.Iu.get(e);
        n ? 
        // Merge the new change with the existing change.
        0 /* ChangeType.Added */ !== t.type && 3 /* ChangeType.Metadata */ === n.type ? this.Iu = this.Iu.insert(e, t) : 3 /* ChangeType.Metadata */ === t.type && 1 /* ChangeType.Removed */ !== n.type ? this.Iu = this.Iu.insert(e, {
            type: n.type,
            doc: t.doc
        }) : 2 /* ChangeType.Modified */ === t.type && 2 /* ChangeType.Modified */ === n.type ? this.Iu = this.Iu.insert(e, {
            type: 2 /* ChangeType.Modified */ ,
            doc: t.doc
        }) : 2 /* ChangeType.Modified */ === t.type && 0 /* ChangeType.Added */ === n.type ? this.Iu = this.Iu.insert(e, {
            type: 0 /* ChangeType.Added */ ,
            doc: t.doc
        }) : 1 /* ChangeType.Removed */ === t.type && 0 /* ChangeType.Added */ === n.type ? this.Iu = this.Iu.remove(e) : 1 /* ChangeType.Removed */ === t.type && 2 /* ChangeType.Modified */ === n.type ? this.Iu = this.Iu.insert(e, {
            type: 1 /* ChangeType.Removed */ ,
            doc: n.doc
        }) : 0 /* ChangeType.Added */ === t.type && 1 /* ChangeType.Removed */ === n.type ? this.Iu = this.Iu.insert(e, {
            type: 2 /* ChangeType.Modified */ ,
            doc: t.doc
        }) : 
        // This includes these cases, which don't make sense:
        // Added->Added
        // Removed->Removed
        // Modified->Added
        // Removed->Modified
        // Metadata->Added
        // Removed->Metadata
        O() : this.Iu = this.Iu.insert(e, t);
    }
    Tu() {
        const t = [];
        return this.Iu.inorderTraversal(((e, n) => {
            t.push(n);
        })), t;
    }
}

class _c {
    constructor(t, e, n, s, i, r, o, u, c) {
        this.query = t, this.docs = e, this.oldDocs = n, this.docChanges = s, this.mutatedKeys = i, 
        this.fromCache = r, this.syncStateChanged = o, this.excludesMetadataChanges = u, 
        this.hasCachedResults = c;
    }
    /** Returns a view snapshot as if all documents in the snapshot were added. */    static fromInitialDocuments(t, e, n, s, i) {
        const r = [];
        return e.forEach((t => {
            r.push({
                type: 0 /* ChangeType.Added */ ,
                doc: t
            });
        })), new _c(t, e, dc.emptySet(e), r, n, s, 
        /* syncStateChanged= */ !0, 
        /* excludesMetadataChanges= */ !1, i);
    }
    get hasPendingWrites() {
        return !this.mutatedKeys.isEmpty();
    }
    isEqual(t) {
        if (!(this.fromCache === t.fromCache && this.hasCachedResults === t.hasCachedResults && this.syncStateChanged === t.syncStateChanged && this.mutatedKeys.isEqual(t.mutatedKeys) && Jn(this.query, t.query) && this.docs.isEqual(t.docs) && this.oldDocs.isEqual(t.oldDocs))) return !1;
        const e = this.docChanges, n = t.docChanges;
        if (e.length !== n.length) return !1;
        for (let t = 0; t < e.length; t++) if (e[t].type !== n[t].type || !e[t].doc.isEqual(n[t].doc)) return !1;
        return !0;
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Holds the listeners and the last received ViewSnapshot for a query being
 * tracked by EventManager.
 */ class mc {
    constructor() {
        this.Eu = void 0, this.listeners = [];
    }
}

class gc {
    constructor() {
        this.queries = new ss((t => Yn(t)), Jn), this.onlineState = "Unknown" /* OnlineState.Unknown */ , 
        this.Au = new Set;
    }
}

async function yc(t, e) {
    const n = F(t), s = e.query;
    let i = !1, r = n.queries.get(s);
    if (r || (i = !0, r = new mc), i) try {
        r.Eu = await n.onListen(s);
    } catch (t) {
        const n = fc(t, `Initialization of query '${Zn(e.query)}' failed`);
        return void e.onError(n);
    }
    if (n.queries.set(s, r), r.listeners.push(e), 
    // Run global snapshot listeners if a consistent snapshot has been emitted.
    e.Ru(n.onlineState), r.Eu) {
        e.vu(r.Eu) && Ec(n);
    }
}

async function pc(t, e) {
    const n = F(t), s = e.query;
    let i = !1;
    const r = n.queries.get(s);
    if (r) {
        const t = r.listeners.indexOf(e);
        t >= 0 && (r.listeners.splice(t, 1), i = 0 === r.listeners.length);
    }
    if (i) return n.queries.delete(s), n.onUnlisten(s);
}

function Ic(t, e) {
    const n = F(t);
    let s = !1;
    for (const t of e) {
        const e = t.query, i = n.queries.get(e);
        if (i) {
            for (const e of i.listeners) e.vu(t) && (s = !0);
            i.Eu = t;
        }
    }
    s && Ec(n);
}

function Tc(t, e, n) {
    const s = F(t), i = s.queries.get(e);
    if (i) for (const t of i.listeners) t.onError(n);
    // Remove all listeners. NOTE: We don't need to call syncEngine.unlisten()
    // after an error.
        s.queries.delete(e);
}

// Call all global snapshot listeners that have been set.
function Ec(t) {
    t.Au.forEach((t => {
        t.next();
    }));
}

/**
 * QueryListener takes a series of internal view snapshots and determines
 * when to raise the event.
 *
 * It uses an Observer to dispatch events.
 */ class Ac {
    constructor(t, e, n) {
        this.query = t, this.bu = e, 
        /**
         * Initial snapshots (e.g. from cache) may not be propagated to the wrapped
         * observer. This flag is set to true once we've actually raised an event.
         */
        this.Pu = !1, this.Vu = null, this.onlineState = "Unknown" /* OnlineState.Unknown */ , 
        this.options = n || {};
    }
    /**
     * Applies the new ViewSnapshot to this listener, raising a user-facing event
     * if applicable (depending on what changed, whether the user has opted into
     * metadata-only changes, etc.). Returns true if a user-facing event was
     * indeed raised.
     */    vu(t) {
        if (!this.options.includeMetadataChanges) {
            // Remove the metadata only changes.
            const e = [];
            for (const n of t.docChanges) 3 /* ChangeType.Metadata */ !== n.type && e.push(n);
            t = new _c(t.query, t.docs, t.oldDocs, e, t.mutatedKeys, t.fromCache, t.syncStateChanged, 
            /* excludesMetadataChanges= */ !0, t.hasCachedResults);
        }
        let e = !1;
        return this.Pu ? this.Su(t) && (this.bu.next(t), e = !0) : this.Du(t, this.onlineState) && (this.Cu(t), 
        e = !0), this.Vu = t, e;
    }
    onError(t) {
        this.bu.error(t);
    }
    /** Returns whether a snapshot was raised. */    Ru(t) {
        this.onlineState = t;
        let e = !1;
        return this.Vu && !this.Pu && this.Du(this.Vu, t) && (this.Cu(this.Vu), e = !0), 
        e;
    }
    Du(t, e) {
        // Always raise the first event when we're synced
        if (!t.fromCache) return !0;
        // NOTE: We consider OnlineState.Unknown as online (it should become Offline
        // or Online if we wait long enough).
                const n = "Offline" /* OnlineState.Offline */ !== e;
        // Don't raise the event if we're online, aren't synced yet (checked
        // above) and are waiting for a sync.
                return (!this.options.xu || !n) && (!t.docs.isEmpty() || t.hasCachedResults || "Offline" /* OnlineState.Offline */ === e);
        // Raise data from cache if we have any documents, have cached results before,
        // or we are offline.
        }
    Su(t) {
        // We don't need to handle includeDocumentMetadataChanges here because
        // the Metadata only changes have already been stripped out if needed.
        // At this point the only changes we will see are the ones we should
        // propagate.
        if (t.docChanges.length > 0) return !0;
        const e = this.Vu && this.Vu.hasPendingWrites !== t.hasPendingWrites;
        return !(!t.syncStateChanged && !e) && !0 === this.options.includeMetadataChanges;
        // Generally we should have hit one of the cases above, but it's possible
        // to get here if there were only metadata docChanges and they got
        // stripped out.
        }
    Cu(t) {
        t = _c.fromInitialDocuments(t.query, t.docs, t.mutatedKeys, t.fromCache, t.hasCachedResults), 
        this.Pu = !0, this.bu.next(t);
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A complete element in the bundle stream, together with the byte length it
 * occupies in the stream.
 */ class Rc {
    constructor(t, 
    // How many bytes this element takes to store in the bundle.
    e) {
        this.Nu = t, this.byteLength = e;
    }
    ku() {
        return "metadata" in this.Nu;
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Helper to convert objects from bundles to model objects in the SDK.
 */ class vc {
    constructor(t) {
        this.serializer = t;
    }
    Hi(t) {
        return Si(this.serializer, t);
    }
    /**
     * Converts a BundleDocument to a MutableDocument.
     */    Ji(t) {
        return t.metadata.exists ? Oi(this.serializer, t.document, !1) : on.newNoDocument(this.Hi(t.metadata.name), this.Yi(t.metadata.readTime));
    }
    Yi(t) {
        return vi(t);
    }
}

/**
 * A class to process the elements from a bundle, load them into local
 * storage and provide progress update while loading.
 */ class bc {
    constructor(t, e, n) {
        this.Ou = t, this.localStore = e, this.serializer = n, 
        /** Batched queries to be saved into storage */
        this.queries = [], 
        /** Batched documents to be saved into storage */
        this.documents = [], 
        /** The collection groups affected by this bundle. */
        this.collectionGroups = new Set, this.progress = Pc(t);
    }
    /**
     * Adds an element from the bundle to the loader.
     *
     * Returns a new progress if adding the element leads to a new progress,
     * otherwise returns null.
     */    $u(t) {
        this.progress.bytesLoaded += t.byteLength;
        let e = this.progress.documentsLoaded;
        if (t.Nu.namedQuery) this.queries.push(t.Nu.namedQuery); else if (t.Nu.documentMetadata) {
            this.documents.push({
                metadata: t.Nu.documentMetadata
            }), t.Nu.documentMetadata.exists || ++e;
            const n = rt.fromString(t.Nu.documentMetadata.name);
            this.collectionGroups.add(n.get(n.length - 2));
        } else t.Nu.document && (this.documents[this.documents.length - 1].document = t.Nu.document, 
        ++e);
        return e !== this.progress.documentsLoaded ? (this.progress.documentsLoaded = e, 
        Object.assign({}, this.progress)) : null;
    }
    Mu(t) {
        const e = new Map, n = new vc(this.serializer);
        for (const s of t) if (s.metadata.queries) {
            const t = n.Hi(s.metadata.name);
            for (const n of s.metadata.queries) {
                const s = (e.get(n) || ws()).add(t);
                e.set(n, s);
            }
        }
        return e;
    }
    /**
     * Update the progress to 'Success' and return the updated progress.
     */    async complete() {
        const t = await ou(this.localStore, new vc(this.serializer), this.documents, this.Ou.id), e = this.Mu(this.documents);
        for (const t of this.queries) await uu(this.localStore, t, e.get(t.name));
        return this.progress.taskState = "Success", {
            progress: this.progress,
            Fu: this.collectionGroups,
            Bu: t
        };
    }
}

/**
 * Returns a `LoadBundleTaskProgress` representing the initial progress of
 * loading a bundle.
 */ function Pc(t) {
    return {
        taskState: "Running",
        documentsLoaded: 0,
        bytesLoaded: 0,
        totalDocuments: t.totalDocuments,
        totalBytes: t.totalBytes
    };
}

/**
 * Returns a `LoadBundleTaskProgress` representing the progress that the loading
 * has succeeded.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Vc {
    constructor(t) {
        this.key = t;
    }
}

class Sc {
    constructor(t) {
        this.key = t;
    }
}

/**
 * View is responsible for computing the final merged truth of what docs are in
 * a query. It gets notified of local and remote changes to docs, and applies
 * the query filters and limits to determine the most correct possible results.
 */ class Dc {
    constructor(t, 
    /** Documents included in the remote target */
    e) {
        this.query = t, this.Lu = e, this.qu = null, this.hasCachedResults = !1, 
        /**
         * A flag whether the view is current with the backend. A view is considered
         * current after it has seen the current flag from the backend and did not
         * lose consistency within the watch stream (e.g. because of an existence
         * filter mismatch).
         */
        this.current = !1, 
        /** Documents in the view but not in the remote target */
        this.Uu = ws(), 
        /** Document Keys that have local changes */
        this.mutatedKeys = ws(), this.Ku = es(t), this.Gu = new dc(this.Ku);
    }
    /**
     * The set of remote documents that the server has told us belongs to the target associated with
     * this view.
     */    get Qu() {
        return this.Lu;
    }
    /**
     * Iterates over a set of doc changes, applies the query limit, and computes
     * what the new results should be, what the changes were, and whether we may
     * need to go back to the local cache for more results. Does not make any
     * changes to the view.
     * @param docChanges - The doc changes to apply to this view.
     * @param previousChanges - If this is being called with a refill, then start
     *        with this set of docs and changes instead of the current view.
     * @returns a new set of docs, changes, and refill flag.
     */    zu(t, e) {
        const n = e ? e.ju : new wc, s = e ? e.Gu : this.Gu;
        let i = e ? e.mutatedKeys : this.mutatedKeys, r = s, o = !1;
        // Track the last doc in a (full) limit. This is necessary, because some
        // update (a delete, or an update moving a doc past the old limit) might
        // mean there is some other document in the local cache that either should
        // come (1) between the old last limit doc and the new last document, in the
        // case of updates, or (2) after the new last document, in the case of
        // deletes. So we keep this doc at the old limit to compare the updates to.
        // Note that this should never get used in a refill (when previousChanges is
        // set), because there will only be adds -- no deletes or updates.
        const u = "F" /* LimitType.First */ === this.query.limitType && s.size === this.query.limit ? s.last() : null, c = "L" /* LimitType.Last */ === this.query.limitType && s.size === this.query.limit ? s.first() : null;
        // Drop documents out to meet limit/limitToLast requirement.
        if (t.inorderTraversal(((t, e) => {
            const a = s.get(t), h = Xn(this.query, e) ? e : null, l = !!a && this.mutatedKeys.has(a.key), f = !!h && (h.hasLocalMutations || 
            // We only consider committed mutations for documents that were
            // mutated during the lifetime of the view.
            this.mutatedKeys.has(h.key) && h.hasCommittedMutations);
            let d = !1;
            // Calculate change
                        if (a && h) {
                a.data.isEqual(h.data) ? l !== f && (n.track({
                    type: 3 /* ChangeType.Metadata */ ,
                    doc: h
                }), d = !0) : this.Wu(a, h) || (n.track({
                    type: 2 /* ChangeType.Modified */ ,
                    doc: h
                }), d = !0, (u && this.Ku(h, u) > 0 || c && this.Ku(h, c) < 0) && (
                // This doc moved from inside the limit to outside the limit.
                // That means there may be some other doc in the local cache
                // that should be included instead.
                o = !0));
            } else !a && h ? (n.track({
                type: 0 /* ChangeType.Added */ ,
                doc: h
            }), d = !0) : a && !h && (n.track({
                type: 1 /* ChangeType.Removed */ ,
                doc: a
            }), d = !0, (u || c) && (
            // A doc was removed from a full limit query. We'll need to
            // requery from the local cache to see if we know about some other
            // doc that should be in the results.
            o = !0));
            d && (h ? (r = r.add(h), i = f ? i.add(t) : i.delete(t)) : (r = r.delete(t), i = i.delete(t)));
        })), null !== this.query.limit) for (;r.size > this.query.limit; ) {
            const t = "F" /* LimitType.First */ === this.query.limitType ? r.last() : r.first();
            r = r.delete(t.key), i = i.delete(t.key), n.track({
                type: 1 /* ChangeType.Removed */ ,
                doc: t
            });
        }
        return {
            Gu: r,
            ju: n,
            Mi: o,
            mutatedKeys: i
        };
    }
    Wu(t, e) {
        // We suppress the initial change event for documents that were modified as
        // part of a write acknowledgment (e.g. when the value of a server transform
        // is applied) as Watch will send us the same document again.
        // By suppressing the event, we only raise two user visible events (one with
        // `hasPendingWrites` and the final state of the document) instead of three
        // (one with `hasPendingWrites`, the modified document with
        // `hasPendingWrites` and the final state of the document).
        return t.hasLocalMutations && e.hasCommittedMutations && !e.hasLocalMutations;
    }
    /**
     * Updates the view with the given ViewDocumentChanges and optionally updates
     * limbo docs and sync state from the provided target change.
     * @param docChanges - The set of changes to make to the view's docs.
     * @param updateLimboDocuments - Whether to update limbo documents based on
     *        this change.
     * @param targetChange - A target change to apply for computing limbo docs and
     *        sync state.
     * @returns A new ViewChange with the given docs, changes, and sync state.
     */
    // PORTING NOTE: The iOS/Android clients always compute limbo document changes.
    applyChanges(t, e, n) {
        const s = this.Gu;
        this.Gu = t.Gu, this.mutatedKeys = t.mutatedKeys;
        // Sort changes based on type and query comparator
        const i = t.ju.Tu();
        i.sort(((t, e) => function(t, e) {
            const n = t => {
                switch (t) {
                  case 0 /* ChangeType.Added */ :
                    return 1;

                  case 2 /* ChangeType.Modified */ :
                  case 3 /* ChangeType.Metadata */ :
                    // A metadata change is converted to a modified change at the public
                    // api layer.  Since we sort by document key and then change type,
                    // metadata and modified changes must be sorted equivalently.
                    return 2;

                  case 1 /* ChangeType.Removed */ :
                    return 0;

                  default:
                    return O();
                }
            };
            return n(t) - n(e);
        }
        /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ (t.type, e.type) || this.Ku(t.doc, e.doc))), this.Hu(n);
        const r = e ? this.Ju() : [], o = 0 === this.Uu.size && this.current ? 1 /* SyncState.Synced */ : 0 /* SyncState.Local */ , u = o !== this.qu;
        if (this.qu = o, 0 !== i.length || u) {
            return {
                snapshot: new _c(this.query, t.Gu, s, i, t.mutatedKeys, 0 /* SyncState.Local */ === o, u, 
                /* excludesMetadataChanges= */ !1, !!n && n.resumeToken.approximateByteSize() > 0),
                Yu: r
            };
        }
        // no changes
        return {
            Yu: r
        };
    }
    /**
     * Applies an OnlineState change to the view, potentially generating a
     * ViewChange if the view's syncState changes as a result.
     */    Ru(t) {
        return this.current && "Offline" /* OnlineState.Offline */ === t ? (
        // If we're offline, set `current` to false and then call applyChanges()
        // to refresh our syncState and generate a ViewChange as appropriate. We
        // are guaranteed to get a new TargetChange that sets `current` back to
        // true once the client is back online.
        this.current = !1, this.applyChanges({
            Gu: this.Gu,
            ju: new wc,
            mutatedKeys: this.mutatedKeys,
            Mi: !1
        }, 
        /* updateLimboDocuments= */ !1)) : {
            Yu: []
        };
    }
    /**
     * Returns whether the doc for the given key should be in limbo.
     */    Zu(t) {
        // If the remote end says it's part of this query, it's not in limbo.
        return !this.Lu.has(t) && (
        // The local store doesn't think it's a result, so it shouldn't be in limbo.
        !!this.Gu.has(t) && !this.Gu.get(t).hasLocalMutations);
    }
    /**
     * Updates syncedDocuments, current, and limbo docs based on the given change.
     * Returns the list of changes to which docs are in limbo.
     */    Hu(t) {
        t && (t.addedDocuments.forEach((t => this.Lu = this.Lu.add(t))), t.modifiedDocuments.forEach((t => {})), 
        t.removedDocuments.forEach((t => this.Lu = this.Lu.delete(t))), this.current = t.current);
    }
    Ju() {
        // We can only determine limbo documents when we're in-sync with the server.
        if (!this.current) return [];
        // TODO(klimt): Do this incrementally so that it's not quadratic when
        // updating many documents.
                const t = this.Uu;
        this.Uu = ws(), this.Gu.forEach((t => {
            this.Zu(t.key) && (this.Uu = this.Uu.add(t.key));
        }));
        // Diff the new limbo docs with the old limbo docs.
        const e = [];
        return t.forEach((t => {
            this.Uu.has(t) || e.push(new Sc(t));
        })), this.Uu.forEach((n => {
            t.has(n) || e.push(new Vc(n));
        })), e;
    }
    /**
     * Update the in-memory state of the current view with the state read from
     * persistence.
     *
     * We update the query view whenever a client's primary status changes:
     * - When a client transitions from primary to secondary, it can miss
     *   LocalStorage updates and its query views may temporarily not be
     *   synchronized with the state on disk.
     * - For secondary to primary transitions, the client needs to update the list
     *   of `syncedDocuments` since secondary clients update their query views
     *   based purely on synthesized RemoteEvents.
     *
     * @param queryResult.documents - The documents that match the query according
     * to the LocalStore.
     * @param queryResult.remoteKeys - The keys of the documents that match the
     * query according to the backend.
     *
     * @returns The ViewChange that resulted from this synchronization.
     */
    // PORTING NOTE: Multi-tab only.
    Xu(t) {
        this.Lu = t.Wi, this.Uu = ws();
        const e = this.zu(t.documents);
        return this.applyChanges(e, /*updateLimboDocuments=*/ !0);
    }
    /**
     * Returns a view snapshot as if this query was just listened to. Contains
     * a document add for every existing document and the `fromCache` and
     * `hasPendingWrites` status of the already established view.
     */
    // PORTING NOTE: Multi-tab only.
    tc() {
        return _c.fromInitialDocuments(this.query, this.Gu, this.mutatedKeys, 0 /* SyncState.Local */ === this.qu, this.hasCachedResults);
    }
}

/**
 * QueryView contains all of the data that SyncEngine needs to keep track of for
 * a particular query.
 */
class Cc {
    constructor(
    /**
     * The query itself.
     */
    t, 
    /**
     * The target number created by the client that is used in the watch
     * stream to identify this query.
     */
    e, 
    /**
     * The view is responsible for computing the final merged truth of what
     * docs are in the query. It gets notified of local and remote changes,
     * and applies the query filters and limits to determine the most correct
     * possible results.
     */
    n) {
        this.query = t, this.targetId = e, this.view = n;
    }
}

/** Tracks a limbo resolution. */ class xc {
    constructor(t) {
        this.key = t, 
        /**
         * Set to true once we've received a document. This is used in
         * getRemoteKeysForTarget() and ultimately used by WatchChangeAggregator to
         * decide whether it needs to manufacture a delete event for the target once
         * the target is CURRENT.
         */
        this.ec = !1;
    }
}

/**
 * An implementation of `SyncEngine` coordinating with other parts of SDK.
 *
 * The parts of SyncEngine that act as a callback to RemoteStore need to be
 * registered individually. This is done in `syncEngineWrite()` and
 * `syncEngineListen()` (as well as `applyPrimaryState()`) as these methods
 * serve as entry points to RemoteStore's functionality.
 *
 * Note: some field defined in this class might have public access level, but
 * the class is not exported so they are only accessible from this module.
 * This is useful to implement optional features (like bundles) in free
 * functions, such that they are tree-shakeable.
 */ class Nc {
    constructor(t, e, n, 
    // PORTING NOTE: Manages state synchronization in multi-tab environments.
    s, i, r) {
        this.localStore = t, this.remoteStore = e, this.eventManager = n, this.sharedClientState = s, 
        this.currentUser = i, this.maxConcurrentLimboResolutions = r, this.nc = {}, this.sc = new ss((t => Yn(t)), Jn), 
        this.ic = new Map, 
        /**
         * The keys of documents that are in limbo for which we haven't yet started a
         * limbo resolution query. The strings in this set are the result of calling
         * `key.path.canonicalString()` where `key` is a `DocumentKey` object.
         *
         * The `Set` type was chosen because it provides efficient lookup and removal
         * of arbitrary elements and it also maintains insertion order, providing the
         * desired queue-like FIFO semantics.
         */
        this.rc = new Set, 
        /**
         * Keeps track of the target ID for each document that is in limbo with an
         * active target.
         */
        this.oc = new ge(ct.comparator), 
        /**
         * Keeps track of the information about an active limbo resolution for each
         * active target ID that was started for the purpose of limbo resolution.
         */
        this.uc = new Map, this.cc = new Vo, 
        /** Stores user completion handlers, indexed by User and BatchId. */
        this.ac = {}, 
        /** Stores user callbacks waiting for all pending writes to be acknowledged. */
        this.hc = new Map, this.lc = so.bn(), this.onlineState = "Unknown" /* OnlineState.Unknown */ , 
        // The primary state is set to `true` or `false` immediately after Firestore
        // startup. In the interim, a client should only be considered primary if
        // `isPrimary` is true.
        this.fc = void 0;
    }
    get isPrimaryClient() {
        return !0 === this.fc;
    }
}

/**
 * Initiates the new listen, resolves promise when listen enqueued to the
 * server. All the subsequent view snapshots or errors are sent to the
 * subscribed handlers. Returns the initial snapshot.
 */
async function kc(t, e) {
    const n = aa(t);
    let s, i;
    const r = n.sc.get(e);
    if (r) 
    // PORTING NOTE: With Multi-Tab Web, it is possible that a query view
    // already exists when EventManager calls us for the first time. This
    // happens when the primary tab is already listening to this query on
    // behalf of another tab and the user of the primary also starts listening
    // to the query. EventManager will not have an assigned target ID in this
    // case and calls `listen` to obtain this ID.
    s = r.targetId, n.sharedClientState.addLocalQueryTarget(s), i = r.view.tc(); else {
        const t = await tu(n.localStore, jn(e));
        n.isPrimaryClient && Bu(n.remoteStore, t);
        const r = n.sharedClientState.addLocalQueryTarget(t.targetId);
        s = t.targetId, i = await Oc(n, e, s, "current" === r, t.resumeToken);
    }
    return i;
}

/**
 * Registers a view for a previously unknown query and computes its initial
 * snapshot.
 */ async function Oc(t, e, n, s, i) {
    // PORTING NOTE: On Web only, we inject the code that registers new Limbo
    // targets based on view changes. This allows us to only depend on Limbo
    // changes when user code includes queries.
    t.dc = (e, n, s) => async function(t, e, n, s) {
        let i = e.view.zu(n);
        i.Mi && (
        // The query has a limit and some docs were removed, so we need
        // to re-run the query against the local store to make sure we
        // didn't lose any good docs that had been past the limit.
        i = await nu(t.localStore, e.query, 
        /* usePreviousResults= */ !1).then((({documents: t}) => e.view.zu(t, i))));
        const r = s && s.targetChanges.get(e.targetId), o = e.view.applyChanges(i, 
        /* updateLimboDocuments= */ t.isPrimaryClient, r);
        return Wc(t, e.targetId, o.Yu), o.snapshot;
    }(t, e, n, s);
    const r = await nu(t.localStore, e, 
    /* usePreviousResults= */ !0), o = new Dc(e, r.Wi), u = o.zu(r.documents), c = hi.createSynthesizedTargetChangeForCurrentChange(n, s && "Offline" /* OnlineState.Offline */ !== t.onlineState, i), a = o.applyChanges(u, 
    /* updateLimboDocuments= */ t.isPrimaryClient, c);
    Wc(t, n, a.Yu);
    const h = new Cc(e, n, o);
    return t.sc.set(e, h), t.ic.has(n) ? t.ic.get(n).push(e) : t.ic.set(n, [ e ]), a.snapshot;
}

/** Stops listening to the query. */ async function $c(t, e) {
    const n = F(t), s = n.sc.get(e), i = n.ic.get(s.targetId);
    if (i.length > 1) return n.ic.set(s.targetId, i.filter((t => !Jn(t, e)))), void n.sc.delete(e);
    // No other queries are mapped to the target, clean up the query and the target.
        if (n.isPrimaryClient) {
        // We need to remove the local query target first to allow us to verify
        // whether any other client is still interested in this target.
        n.sharedClientState.removeLocalQueryTarget(s.targetId);
        n.sharedClientState.isActiveQueryTarget(s.targetId) || await eu(n.localStore, s.targetId, 
        /*keepPersistedTargetData=*/ !1).then((() => {
            n.sharedClientState.clearQueryState(s.targetId), Lu(n.remoteStore, s.targetId), 
            zc(n, s.targetId);
        })).catch(Et);
    } else zc(n, s.targetId), await eu(n.localStore, s.targetId, 
    /*keepPersistedTargetData=*/ !0);
}

/**
 * Initiates the write of local mutation batch which involves adding the
 * writes to the mutation queue, notifying the remote store about new
 * mutations and raising events for any changes this write caused.
 *
 * The promise returned by this call is resolved when the above steps
 * have completed, *not* when the write was acked by the backend. The
 * userCallback is resolved once the write was acked/rejected by the
 * backend (or failed locally for any other reason).
 */ async function Mc(t, e, n) {
    const s = ha(t);
    try {
        const t = await function(t, e) {
            const n = F(t), s = nt.now(), i = e.reduce(((t, e) => t.add(e.key)), ws());
            let r, o;
            return n.persistence.runTransaction("Locally write mutations", "readwrite", (t => {
                // Figure out which keys do not have a remote version in the cache, this
                // is needed to create the right overlay mutation: if no remote version
                // presents, we do not need to create overlays as patch mutations.
                // TODO(Overlay): Is there a better way to determine this? Using the
                //  document version does not work because local mutations set them back
                //  to 0.
                let u = rs(), c = ws();
                return n.Ki.getEntries(t, i).next((t => {
                    u = t, u.forEach(((t, e) => {
                        e.isValidDocument() || (c = c.add(t));
                    }));
                })).next((() => n.localDocuments.getOverlayedDocuments(t, u))).next((i => {
                    r = i;
                    // For non-idempotent mutations (such as `FieldValue.increment()`),
                    // we record the base state in a separate patch mutation. This is
                    // later used to guarantee consistent values and prevents flicker
                    // even if the backend sends us an update that already includes our
                    // transform.
                    const o = [];
                    for (const t of e) {
                        const e = qs(t, r.get(t.key).overlayedDocument);
                        null != e && 
                        // NOTE: The base state should only be applied if there's some
                        // existing document to override, so use a Precondition of
                        // exists=true
                        o.push(new Gs(t.key, e, rn(e.value.mapValue), Os.exists(!0)));
                    }
                    return n.mutationQueue.addMutationBatch(t, s, o, e);
                })).next((e => {
                    o = e;
                    const s = e.applyToLocalDocumentSet(r, c);
                    return n.documentOverlayCache.saveOverlays(t, e.batchId, s);
                }));
            })).then((() => ({
                batchId: o.batchId,
                changes: cs(r)
            })));
        }(s.localStore, e);
        s.sharedClientState.addPendingMutation(t.batchId), function(t, e, n) {
            let s = t.ac[t.currentUser.toKey()];
            s || (s = new ge(X));
            s = s.insert(e, n), t.ac[t.currentUser.toKey()] = s;
        }
        /**
 * Resolves or rejects the user callback for the given batch and then discards
 * it.
 */ (s, t.batchId, n), await Yc(s, t.changes), await Zu(s.remoteStore);
    } catch (t) {
        // If we can't persist the mutation, we reject the user callback and
        // don't send the mutation. The user can then retry the write.
        const e = fc(t, "Failed to persist write");
        n.reject(e);
    }
}

/**
 * Applies one remote event to the sync engine, notifying any views of the
 * changes, and releasing any pending mutation batches that would become
 * visible because of the snapshot version the remote event contains.
 */ async function Fc(t, e) {
    const n = F(t);
    try {
        const t = await Yo(n.localStore, e);
        // Update `receivedDocument` as appropriate for any limbo targets.
                e.targetChanges.forEach(((t, e) => {
            const s = n.uc.get(e);
            s && (
            // Since this is a limbo resolution lookup, it's for a single document
            // and it could be added, modified, or removed, but not a combination.
            $(t.addedDocuments.size + t.modifiedDocuments.size + t.removedDocuments.size <= 1), 
            t.addedDocuments.size > 0 ? s.ec = !0 : t.modifiedDocuments.size > 0 ? $(s.ec) : t.removedDocuments.size > 0 && ($(s.ec), 
            s.ec = !1));
        })), await Yc(n, t, e);
    } catch (t) {
        await Et(t);
    }
}

/**
 * Applies an OnlineState change to the sync engine and notifies any views of
 * the change.
 */ function Bc(t, e, n) {
    const s = F(t);
    // If we are the secondary client, we explicitly ignore the remote store's
    // online state (the local client may go offline, even though the primary
    // tab remains online) and only apply the primary tab's online state from
    // SharedClientState.
        if (s.isPrimaryClient && 0 /* OnlineStateSource.RemoteStore */ === n || !s.isPrimaryClient && 1 /* OnlineStateSource.SharedClientState */ === n) {
        const t = [];
        s.sc.forEach(((n, s) => {
            const i = s.view.Ru(e);
            i.snapshot && t.push(i.snapshot);
        })), function(t, e) {
            const n = F(t);
            n.onlineState = e;
            let s = !1;
            n.queries.forEach(((t, n) => {
                for (const t of n.listeners) 
                // Run global snapshot listeners if a consistent snapshot has been emitted.
                t.Ru(e) && (s = !0);
            })), s && Ec(n);
        }(s.eventManager, e), t.length && s.nc.zo(t), s.onlineState = e, s.isPrimaryClient && s.sharedClientState.setOnlineState(e);
    }
}

/**
 * Rejects the listen for the given targetID. This can be triggered by the
 * backend for any active target.
 *
 * @param syncEngine - The sync engine implementation.
 * @param targetId - The targetID corresponds to one previously initiated by the
 * user as part of TargetData passed to listen() on RemoteStore.
 * @param err - A description of the condition that has forced the rejection.
 * Nearly always this will be an indication that the user is no longer
 * authorized to see the data matching the target.
 */ async function Lc(t, e, n) {
    const s = F(t);
    // PORTING NOTE: Multi-tab only.
        s.sharedClientState.updateQueryState(e, "rejected", n);
    const i = s.uc.get(e), r = i && i.key;
    if (r) {
        // TODO(klimt): We really only should do the following on permission
        // denied errors, but we don't have the cause code here.
        // It's a limbo doc. Create a synthetic event saying it was deleted.
        // This is kind of a hack. Ideally, we would have a method in the local
        // store to purge a document. However, it would be tricky to keep all of
        // the local store's invariants with another method.
        let t = new ge(ct.comparator);
        // TODO(b/217189216): This limbo document should ideally have a read time,
        // so that it is picked up by any read-time based scans. The backend,
        // however, does not send a read time for target removals.
                t = t.insert(r, on.newNoDocument(r, st.min()));
        const n = ws().add(r), i = new ai(st.min(), 
        /* targetChanges= */ new Map, 
        /* targetMismatches= */ new Ie(X), t, n);
        await Fc(s, i), 
        // Since this query failed, we won't want to manually unlisten to it.
        // We only remove it from bookkeeping after we successfully applied the
        // RemoteEvent. If `applyRemoteEvent()` throws, we want to re-listen to
        // this query when the RemoteStore restarts the Watch stream, which should
        // re-trigger the target failure.
        s.oc = s.oc.remove(r), s.uc.delete(e), Jc(s);
    } else await eu(s.localStore, e, 
    /* keepPersistedTargetData */ !1).then((() => zc(s, e, n))).catch(Et);
}

async function qc(t, e) {
    const n = F(t), s = e.batch.batchId;
    try {
        const t = await Ho(n.localStore, e);
        // The local store may or may not be able to apply the write result and
        // raise events immediately (depending on whether the watcher is caught
        // up), so we raise user callbacks first so that they consistently happen
        // before listen events.
                Qc(n, s, /*error=*/ null), Gc(n, s), n.sharedClientState.updateMutationState(s, "acknowledged"), 
        await Yc(n, t);
    } catch (t) {
        await Et(t);
    }
}

async function Uc(t, e, n) {
    const s = F(t);
    try {
        const t = await function(t, e) {
            const n = F(t);
            return n.persistence.runTransaction("Reject batch", "readwrite-primary", (t => {
                let s;
                return n.mutationQueue.lookupMutationBatch(t, e).next((e => ($(null !== e), s = e.keys(), 
                n.mutationQueue.removeMutationBatch(t, e)))).next((() => n.mutationQueue.performConsistencyCheck(t))).next((() => n.documentOverlayCache.removeOverlaysForBatchId(t, s, e))).next((() => n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(t, s))).next((() => n.localDocuments.getDocuments(t, s)));
            }));
        }
        /**
 * Returns the largest (latest) batch id in mutation queue that is pending
 * server response.
 *
 * Returns `BATCHID_UNKNOWN` if the queue is empty.
 */ (s.localStore, e);
        // The local store may or may not be able to apply the write result and
        // raise events immediately (depending on whether the watcher is caught up),
        // so we raise user callbacks first so that they consistently happen before
        // listen events.
                Qc(s, e, n), Gc(s, e), s.sharedClientState.updateMutationState(e, "rejected", n), 
        await Yc(s, t);
    } catch (n) {
        await Et(n);
    }
}

/**
 * Registers a user callback that resolves when all pending mutations at the moment of calling
 * are acknowledged .
 */ async function Kc(t, e) {
    const n = F(t);
    Qu(n.remoteStore) || C("SyncEngine", "The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled.");
    try {
        const t = await function(t) {
            const e = F(t);
            return e.persistence.runTransaction("Get highest unacknowledged batch id", "readonly", (t => e.mutationQueue.getHighestUnacknowledgedBatchId(t)));
        }(n.localStore);
        if (-1 === t) 
        // Trigger the callback right away if there is no pending writes at the moment.
        return void e.resolve();
        const s = n.hc.get(t) || [];
        s.push(e), n.hc.set(t, s);
    } catch (t) {
        const n = fc(t, "Initialization of waitForPendingWrites() operation failed");
        e.reject(n);
    }
}

/**
 * Triggers the callbacks that are waiting for this batch id to get acknowledged by server,
 * if there are any.
 */ function Gc(t, e) {
    (t.hc.get(e) || []).forEach((t => {
        t.resolve();
    })), t.hc.delete(e);
}

/** Reject all outstanding callbacks waiting for pending writes to complete. */ function Qc(t, e, n) {
    const s = F(t);
    let i = s.ac[s.currentUser.toKey()];
    // NOTE: Mutations restored from persistence won't have callbacks, so it's
    // okay for there to be no callback for this ID.
        if (i) {
        const t = i.get(e);
        t && (n ? t.reject(n) : t.resolve(), i = i.remove(e)), s.ac[s.currentUser.toKey()] = i;
    }
}

function zc(t, e, n = null) {
    t.sharedClientState.removeLocalQueryTarget(e);
    for (const s of t.ic.get(e)) t.sc.delete(s), n && t.nc.wc(s, n);
    if (t.ic.delete(e), t.isPrimaryClient) {
        t.cc.hs(e).forEach((e => {
            t.cc.containsKey(e) || 
            // We removed the last reference for this key
            jc(t, e);
        }));
    }
}

function jc(t, e) {
    t.rc.delete(e.path.canonicalString());
    // It's possible that the target already got removed because the query failed. In that case,
    // the key won't exist in `limboTargetsByKey`. Only do the cleanup if we still have the target.
    const n = t.oc.get(e);
    null !== n && (Lu(t.remoteStore, n), t.oc = t.oc.remove(e), t.uc.delete(n), Jc(t));
}

function Wc(t, e, n) {
    for (const s of n) if (s instanceof Vc) t.cc.addReference(s.key, e), Hc(t, s); else if (s instanceof Sc) {
        C("SyncEngine", "Document no longer in limbo: " + s.key), t.cc.removeReference(s.key, e);
        t.cc.containsKey(s.key) || 
        // We removed the last reference for this key
        jc(t, s.key);
    } else O();
}

function Hc(t, e) {
    const n = e.key, s = n.path.canonicalString();
    t.oc.get(n) || t.rc.has(s) || (C("SyncEngine", "New document in limbo: " + n), t.rc.add(s), 
    Jc(t));
}

/**
 * Starts listens for documents in limbo that are enqueued for resolution,
 * subject to a maximum number of concurrent resolutions.
 *
 * Without bounding the number of concurrent resolutions, the server can fail
 * with "resource exhausted" errors which can lead to pathological client
 * behavior as seen in https://github.com/firebase/firebase-js-sdk/issues/2683.
 */ function Jc(t) {
    for (;t.rc.size > 0 && t.oc.size < t.maxConcurrentLimboResolutions; ) {
        const e = t.rc.values().next().value;
        t.rc.delete(e);
        const n = new ct(rt.fromString(e)), s = t.lc.next();
        t.uc.set(s, new xc(n)), t.oc = t.oc.insert(n, s), Bu(t.remoteStore, new tr(jn(qn(n.path)), s, 2 /* TargetPurpose.LimboResolution */ , Ot.ct));
    }
}

async function Yc(t, e, n) {
    const s = F(t), i = [], r = [], o = [];
    s.sc.isEmpty() || (s.sc.forEach(((t, u) => {
        o.push(s.dc(u, e, n).then((t => {
            // Update views if there are actual changes.
            if (
            // If there are changes, or we are handling a global snapshot, notify
            // secondary clients to update query state.
            (t || n) && s.isPrimaryClient && s.sharedClientState.updateQueryState(u.targetId, (null == t ? void 0 : t.fromCache) ? "not-current" : "current"), 
            t) {
                i.push(t);
                const e = Go.Di(u.targetId, t);
                r.push(e);
            }
        })));
    })), await Promise.all(o), s.nc.zo(i), await async function(t, e) {
        const n = F(t);
        try {
            await n.persistence.runTransaction("notifyLocalViewChanges", "readwrite", (t => At.forEach(e, (e => At.forEach(e.Vi, (s => n.persistence.referenceDelegate.addReference(t, e.targetId, s))).next((() => At.forEach(e.Si, (s => n.persistence.referenceDelegate.removeReference(t, e.targetId, s)))))))));
        } catch (t) {
            if (!Vt(t)) throw t;
            // If `notifyLocalViewChanges` fails, we did not advance the sequence
            // number for the documents that were included in this transaction.
            // This might trigger them to be deleted earlier than they otherwise
            // would have, but it should not invalidate the integrity of the data.
            C("LocalStore", "Failed to update sequence numbers: " + t);
        }
        for (const t of e) {
            const e = t.targetId;
            if (!t.fromCache) {
                const t = n.Li.get(e), s = t.snapshotVersion, i = t.withLastLimboFreeSnapshotVersion(s);
                // Advance the last limbo free snapshot version
                                n.Li = n.Li.insert(e, i);
            }
        }
    }(s.localStore, r));
}

async function Zc(t, e) {
    const n = F(t);
    if (!n.currentUser.isEqual(e)) {
        C("SyncEngine", "User change. New user:", e.toKey());
        const t = await Wo(n.localStore, e);
        n.currentUser = e, 
        // Fails tasks waiting for pending writes requested by previous user.
        function(t, e) {
            t.hc.forEach((t => {
                t.forEach((t => {
                    t.reject(new L(B.CANCELLED, e));
                }));
            })), t.hc.clear();
        }(n, "'waitForPendingWrites' promise is rejected due to a user change."), 
        // TODO(b/114226417): Consider calling this only in the primary tab.
        n.sharedClientState.handleUserChange(e, t.removedBatchIds, t.addedBatchIds), await Yc(n, t.Qi);
    }
}

function Xc(t, e) {
    const n = F(t), s = n.uc.get(e);
    if (s && s.ec) return ws().add(s.key);
    {
        let t = ws();
        const s = n.ic.get(e);
        if (!s) return t;
        for (const e of s) {
            const s = n.sc.get(e);
            t = t.unionWith(s.view.Qu);
        }
        return t;
    }
}

/**
 * Reconcile the list of synced documents in an existing view with those
 * from persistence.
 */ async function ta(t, e) {
    const n = F(t), s = await nu(n.localStore, e.query, 
    /* usePreviousResults= */ !0), i = e.view.Xu(s);
    return n.isPrimaryClient && Wc(n, e.targetId, i.Yu), i;
}

/**
 * Retrieves newly changed documents from remote document cache and raises
 * snapshots if needed.
 */
// PORTING NOTE: Multi-Tab only.
async function ea(t, e) {
    const n = F(t);
    return iu(n.localStore, e).then((t => Yc(n, t)));
}

/** Applies a mutation state to an existing batch.  */
// PORTING NOTE: Multi-Tab only.
async function na(t, e, n, s) {
    const i = F(t), r = await function(t, e) {
        const n = F(t), s = F(n.mutationQueue);
        return n.persistence.runTransaction("Lookup mutation documents", "readonly", (t => s.In(t, e).next((e => e ? n.localDocuments.getDocuments(t, e) : At.resolve(null)))));
    }
    // PORTING NOTE: Multi-Tab only.
    (i.localStore, e);
    null !== r ? ("pending" === n ? 
    // If we are the primary client, we need to send this write to the
    // backend. Secondary clients will ignore these writes since their remote
    // connection is disabled.
    await Zu(i.remoteStore) : "acknowledged" === n || "rejected" === n ? (
    // NOTE: Both these methods are no-ops for batches that originated from
    // other clients.
    Qc(i, e, s || null), Gc(i, e), function(t, e) {
        F(F(t).mutationQueue).En(e);
    }
    // PORTING NOTE: Multi-Tab only.
    (i.localStore, e)) : O(), await Yc(i, r)) : 
    // A throttled tab may not have seen the mutation before it was completed
    // and removed from the mutation queue, in which case we won't have cached
    // the affected documents. In this case we can safely ignore the update
    // since that means we didn't apply the mutation locally at all (if we
    // had, we would have cached the affected documents), and so we will just
    // see any resulting document changes via normal remote document updates
    // as applicable.
    C("SyncEngine", "Cannot apply mutation batch with id: " + e);
}

/** Applies a query target change from a different tab. */
// PORTING NOTE: Multi-Tab only.
async function sa(t, e) {
    const n = F(t);
    if (aa(n), ha(n), !0 === e && !0 !== n.fc) {
        // Secondary tabs only maintain Views for their local listeners and the
        // Views internal state may not be 100% populated (in particular
        // secondary tabs don't track syncedDocuments, the set of documents the
        // server considers to be in the target). So when a secondary becomes
        // primary, we need to need to make sure that all views for all targets
        // match the state on disk.
        const t = n.sharedClientState.getAllActiveQueryTargets(), e = await ia(n, t.toArray());
        n.fc = !0, await cc(n.remoteStore, !0);
        for (const t of e) Bu(n.remoteStore, t);
    } else if (!1 === e && !1 !== n.fc) {
        const t = [];
        let e = Promise.resolve();
        n.ic.forEach(((s, i) => {
            n.sharedClientState.isLocalQueryTarget(i) ? t.push(i) : e = e.then((() => (zc(n, i), 
            eu(n.localStore, i, 
            /*keepPersistedTargetData=*/ !0)))), Lu(n.remoteStore, i);
        })), await e, await ia(n, t), 
        // PORTING NOTE: Multi-Tab only.
        function(t) {
            const e = F(t);
            e.uc.forEach(((t, n) => {
                Lu(e.remoteStore, n);
            })), e.cc.ls(), e.uc = new Map, e.oc = new ge(ct.comparator);
        }
        /**
 * Reconcile the query views of the provided query targets with the state from
 * persistence. Raises snapshots for any changes that affect the local
 * client and returns the updated state of all target's query data.
 *
 * @param syncEngine - The sync engine implementation
 * @param targets - the list of targets with views that need to be recomputed
 * @param transitionToPrimary - `true` iff the tab transitions from a secondary
 * tab to a primary tab
 */
        // PORTING NOTE: Multi-Tab only.
        (n), n.fc = !1, await cc(n.remoteStore, !1);
    }
}

async function ia(t, e, n) {
    const s = F(t), i = [], r = [];
    for (const t of e) {
        let e;
        const n = s.ic.get(t);
        if (n && 0 !== n.length) {
            // For queries that have a local View, we fetch their current state
            // from LocalStore (as the resume token and the snapshot version
            // might have changed) and reconcile their views with the persisted
            // state (the list of syncedDocuments may have gotten out of sync).
            e = await tu(s.localStore, jn(n[0]));
            for (const t of n) {
                const e = s.sc.get(t), n = await ta(s, e);
                n.snapshot && r.push(n.snapshot);
            }
        } else {
            // For queries that never executed on this client, we need to
            // allocate the target in LocalStore and initialize a new View.
            const n = await su(s.localStore, t);
            e = await tu(s.localStore, n), await Oc(s, ra(n), t, 
            /*current=*/ !1, e.resumeToken);
        }
        i.push(e);
    }
    return s.nc.zo(r), i;
}

/**
 * Creates a `Query` object from the specified `Target`. There is no way to
 * obtain the original `Query`, so we synthesize a `Query` from the `Target`
 * object.
 *
 * The synthesized result might be different from the original `Query`, but
 * since the synthesized `Query` should return the same results as the
 * original one (only the presentation of results might differ), the potential
 * difference will not cause issues.
 */
// PORTING NOTE: Multi-Tab only.
function ra(t) {
    return Ln(t.path, t.collectionGroup, t.orderBy, t.filters, t.limit, "F" /* LimitType.First */ , t.startAt, t.endAt);
}

/** Returns the IDs of the clients that are currently active. */
// PORTING NOTE: Multi-Tab only.
function oa(t) {
    const e = F(t);
    return F(F(e.localStore).persistence).bi();
}

/** Applies a query target change from a different tab. */
// PORTING NOTE: Multi-Tab only.
async function ua(t, e, n, s) {
    const i = F(t);
    if (i.fc) 
    // If we receive a target state notification via WebStorage, we are
    // either already secondary or another tab has taken the primary lease.
    return void C("SyncEngine", "Ignoring unexpected query state notification.");
    const r = i.ic.get(e);
    if (r && r.length > 0) switch (n) {
      case "current":
      case "not-current":
        {
            const t = await iu(i.localStore, ts(r[0])), s = ai.createSynthesizedRemoteEventForCurrentChange(e, "current" === n, be.EMPTY_BYTE_STRING);
            await Yc(i, t, s);
            break;
        }

      case "rejected":
        await eu(i.localStore, e, 
        /* keepPersistedTargetData */ !0), zc(i, e, s);
        break;

      default:
        O();
    }
}

/** Adds or removes Watch targets for queries from different tabs. */ async function ca(t, e, n) {
    const s = aa(t);
    if (s.fc) {
        for (const t of e) {
            if (s.ic.has(t)) {
                // A target might have been added in a previous attempt
                C("SyncEngine", "Adding an already active target " + t);
                continue;
            }
            const e = await su(s.localStore, t), n = await tu(s.localStore, e);
            await Oc(s, ra(e), n.targetId, 
            /*current=*/ !1, n.resumeToken), Bu(s.remoteStore, n);
        }
        for (const t of n) 
        // Check that the target is still active since the target might have been
        // removed if it has been rejected by the backend.
        s.ic.has(t) && 
        // Release queries that are still active.
        await eu(s.localStore, t, 
        /* keepPersistedTargetData */ !1).then((() => {
            Lu(s.remoteStore, t), zc(s, t);
        })).catch(Et);
    }
}

function aa(t) {
    const e = F(t);
    return e.remoteStore.remoteSyncer.applyRemoteEvent = Fc.bind(null, e), e.remoteStore.remoteSyncer.getRemoteKeysForTarget = Xc.bind(null, e), 
    e.remoteStore.remoteSyncer.rejectListen = Lc.bind(null, e), e.nc.zo = Ic.bind(null, e.eventManager), 
    e.nc.wc = Tc.bind(null, e.eventManager), e;
}

function ha(t) {
    const e = F(t);
    return e.remoteStore.remoteSyncer.applySuccessfulWrite = qc.bind(null, e), e.remoteStore.remoteSyncer.rejectFailedWrite = Uc.bind(null, e), 
    e;
}

/**
 * Loads a Firestore bundle into the SDK. The returned promise resolves when
 * the bundle finished loading.
 *
 * @param syncEngine - SyncEngine to use.
 * @param bundleReader - Bundle to load into the SDK.
 * @param task - LoadBundleTask used to update the loading progress to public API.
 */ function la(t, e, n) {
    const s = F(t);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
        (
    /** Loads a bundle and returns the list of affected collection groups. */
    async function(t, e, n) {
        try {
            const s = await e.getMetadata();
            if (await function(t, e) {
                const n = F(t), s = vi(e.createTime);
                return n.persistence.runTransaction("hasNewerBundle", "readonly", (t => n.xs.getBundleMetadata(t, e.id))).then((t => !!t && t.createTime.compareTo(s) >= 0));
            }
            /**
 * Saves the given `BundleMetadata` to local persistence.
 */ (t.localStore, s)) return await e.close(), n._completeWith(function(t) {
                return {
                    taskState: "Success",
                    documentsLoaded: t.totalDocuments,
                    bytesLoaded: t.totalBytes,
                    totalDocuments: t.totalDocuments,
                    totalBytes: t.totalBytes
                };
            }(s)), Promise.resolve(new Set);
            n._updateProgress(Pc(s));
            const i = new bc(s, t.localStore, e.serializer);
            let r = await e._c();
            for (;r; ) {
                const t = await i.$u(r);
                t && n._updateProgress(t), r = await e._c();
            }
            const o = await i.complete();
            return await Yc(t, o.Bu, 
            /* remoteEvent */ void 0), 
            // Save metadata, so loading the same bundle will skip.
            await function(t, e) {
                const n = F(t);
                return n.persistence.runTransaction("Save bundle", "readwrite", (t => n.xs.saveBundleMetadata(t, e)));
            }
            /**
 * Returns a promise of a `NamedQuery` associated with given query name. Promise
 * resolves to undefined if no persisted data can be found.
 */ (t.localStore, s), n._completeWith(o.progress), Promise.resolve(o.Fu);
        } catch (t) {
            return N("SyncEngine", `Loading bundle failed with ${t}`), n._failWith(t), Promise.resolve(new Set);
        }
    }
    /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
    /**
 * Provides all components needed for Firestore with in-memory persistence.
 * Uses EagerGC garbage collection.
 */)(s, e, n).then((t => {
        s.sharedClientState.notifyBundleLoaded(t);
    }));
}

class fa {
    constructor() {
        this.synchronizeTabs = !1;
    }
    async initialize(t) {
        this.serializer = Vu(t.databaseInfo.databaseId), this.sharedClientState = this.createSharedClientState(t), 
        this.persistence = this.createPersistence(t), await this.persistence.start(), this.localStore = this.createLocalStore(t), 
        this.gcScheduler = this.createGarbageCollectionScheduler(t, this.localStore), this.indexBackfillerScheduler = this.createIndexBackfillerScheduler(t, this.localStore);
    }
    createGarbageCollectionScheduler(t, e) {
        return null;
    }
    createIndexBackfillerScheduler(t, e) {
        return null;
    }
    createLocalStore(t) {
        return jo(this.persistence, new Qo, t.initialUser, this.serializer);
    }
    createPersistence(t) {
        return new ko($o.Fs, this.serializer);
    }
    createSharedClientState(t) {
        return new gu;
    }
    async terminate() {
        this.gcScheduler && this.gcScheduler.stop(), await this.sharedClientState.shutdown(), 
        await this.persistence.shutdown();
    }
}

/**
 * Provides all components needed for Firestore with IndexedDB persistence.
 */ class da extends fa {
    constructor(t, e, n) {
        super(), this.mc = t, this.cacheSizeBytes = e, this.forceOwnership = n, this.synchronizeTabs = !1;
    }
    async initialize(t) {
        await super.initialize(t), await this.mc.initialize(this, t), 
        // Enqueue writes from a previous session
        await ha(this.mc.syncEngine), await Zu(this.mc.remoteStore), 
        // NOTE: This will immediately call the listener, so we make sure to
        // set it after localStore / remoteStore are started.
        await this.persistence.hi((() => (this.gcScheduler && !this.gcScheduler.started && this.gcScheduler.start(), 
        this.indexBackfillerScheduler && !this.indexBackfillerScheduler.started && this.indexBackfillerScheduler.start(), 
        Promise.resolve())));
    }
    createLocalStore(t) {
        return jo(this.persistence, new Qo, t.initialUser, this.serializer);
    }
    createGarbageCollectionScheduler(t, e) {
        const n = this.persistence.referenceDelegate.garbageCollector;
        return new ho(n, t.asyncQueue, e);
    }
    createIndexBackfillerScheduler(t, e) {
        const n = new kt(e, this.persistence);
        return new Nt(t.asyncQueue, n);
    }
    createPersistence(t) {
        const e = Ko(t.databaseInfo.databaseId, t.databaseInfo.persistenceKey), n = void 0 !== this.cacheSizeBytes ? Hr.withCacheSize(this.cacheSizeBytes) : Hr.DEFAULT;
        return new Lo(this.synchronizeTabs, e, t.clientId, n, t.asyncQueue, bu(), Pu(), this.serializer, this.sharedClientState, !!this.forceOwnership);
    }
    createSharedClientState(t) {
        return new gu;
    }
}

/**
 * Provides all components needed for Firestore with multi-tab IndexedDB
 * persistence.
 *
 * In the legacy client, this provider is used to provide both multi-tab and
 * non-multi-tab persistence since we cannot tell at build time whether
 * `synchronizeTabs` will be enabled.
 */ class wa extends da {
    constructor(t, e) {
        super(t, e, /* forceOwnership= */ !1), this.mc = t, this.cacheSizeBytes = e, this.synchronizeTabs = !0;
    }
    async initialize(t) {
        await super.initialize(t);
        const e = this.mc.syncEngine;
        this.sharedClientState instanceof mu && (this.sharedClientState.syncEngine = {
            $r: na.bind(null, e),
            Mr: ua.bind(null, e),
            Fr: ca.bind(null, e),
            bi: oa.bind(null, e),
            Or: ea.bind(null, e)
        }, await this.sharedClientState.start()), 
        // NOTE: This will immediately call the listener, so we make sure to
        // set it after localStore / remoteStore are started.
        await this.persistence.hi((async t => {
            await sa(this.mc.syncEngine, t), this.gcScheduler && (t && !this.gcScheduler.started ? this.gcScheduler.start() : t || this.gcScheduler.stop()), 
            this.indexBackfillerScheduler && (t && !this.indexBackfillerScheduler.started ? this.indexBackfillerScheduler.start() : t || this.indexBackfillerScheduler.stop());
        }));
    }
    createSharedClientState(t) {
        const e = bu();
        if (!mu.D(e)) throw new L(B.UNIMPLEMENTED, "IndexedDB persistence is only available on platforms that support LocalStorage.");
        const n = Ko(t.databaseInfo.databaseId, t.databaseInfo.persistenceKey);
        return new mu(e, t.asyncQueue, n, t.clientId, t.initialUser);
    }
}

/**
 * Initializes and wires the components that are needed to interface with the
 * network.
 */ class _a {
    async initialize(t, e) {
        this.localStore || (this.localStore = t.localStore, this.sharedClientState = t.sharedClientState, 
        this.datastore = this.createDatastore(e), this.remoteStore = this.createRemoteStore(e), 
        this.eventManager = this.createEventManager(e), this.syncEngine = this.createSyncEngine(e, 
        /* startAsPrimary=*/ !t.synchronizeTabs), this.sharedClientState.onlineStateHandler = t => Bc(this.syncEngine, t, 1 /* OnlineStateSource.SharedClientState */), 
        this.remoteStore.remoteSyncer.handleCredentialChange = Zc.bind(null, this.syncEngine), 
        await cc(this.remoteStore, this.syncEngine.isPrimaryClient));
    }
    createEventManager(t) {
        return new gc;
    }
    createDatastore(t) {
        const e = Vu(t.databaseInfo.databaseId), n = (s = t.databaseInfo, new vu(s));
        var s;
        /** Return the Platform-specific connectivity monitor. */        return function(t, e, n, s) {
            return new Nu(t, e, n, s);
        }(t.authCredentials, t.appCheckCredentials, n, e);
    }
    createRemoteStore(t) {
        return e = this.localStore, n = this.datastore, s = t.asyncQueue, i = t => Bc(this.syncEngine, t, 0 /* OnlineStateSource.RemoteStore */), 
        r = pu.D() ? new pu : new yu, new $u(e, n, s, i, r);
        var e, n, s, i, r;
        /** Re-enables the network. Idempotent. */    }
    createSyncEngine(t, e) {
        return function(t, e, n, 
        // PORTING NOTE: Manages state synchronization in multi-tab environments.
        s, i, r, o) {
            const u = new Nc(t, e, n, s, i, r);
            return o && (u.fc = !0), u;
        }(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, t.initialUser, t.maxConcurrentLimboResolutions, e);
    }
    terminate() {
        return async function(t) {
            const e = F(t);
            C("RemoteStore", "RemoteStore shutting down."), e.du.add(5 /* OfflineCause.Shutdown */), 
            await Fu(e), e._u.shutdown(), 
            // Set the OnlineState to Unknown (rather than Offline) to avoid potentially
            // triggering spurious listener events with cached data, etc.
            e.mu.set("Unknown" /* OnlineState.Unknown */);
        }(this.remoteStore);
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * How many bytes to read each time when `ReadableStreamReader.read()` is
 * called. Only applicable for byte streams that we control (e.g. those backed
 * by an UInt8Array).
 */
/**
 * Builds a `ByteStreamReader` from a UInt8Array.
 * @param source - The data source to use.
 * @param bytesPerRead - How many bytes each `read()` from the returned reader
 *        will read.
 */
function ma(t, e = 10240) {
    let n = 0;
    // The TypeScript definition for ReadableStreamReader changed. We use
    // `any` here to allow this code to compile with different versions.
    // See https://github.com/microsoft/TypeScript/issues/42970
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async read() {
            if (n < t.byteLength) {
                const s = {
                    value: t.slice(n, n + e),
                    done: !1
                };
                return n += e, s;
            }
            return {
                done: !0
            };
        },
        async cancel() {},
        releaseLock() {},
        closed: Promise.resolve()
    };
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * On web, a `ReadableStream` is wrapped around by a `ByteStreamReader`.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
 * A wrapper implementation of Observer<T> that will dispatch events
 * asynchronously. To allow immediate silencing, a mute call is added which
 * causes events scheduled to no longer be raised.
 */
class ga {
    constructor(t) {
        this.observer = t, 
        /**
         * When set to true, will not raise future events. Necessary to deal with
         * async detachment of listener.
         */
        this.muted = !1;
    }
    next(t) {
        this.observer.next && this.gc(this.observer.next, t);
    }
    error(t) {
        this.observer.error ? this.gc(this.observer.error, t) : x("Uncaught Error in snapshot listener:", t.toString());
    }
    yc() {
        this.muted = !0;
    }
    gc(t, e) {
        this.muted || setTimeout((() => {
            this.muted || t(e);
        }), 0);
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A class representing a bundle.
 *
 * Takes a bundle stream or buffer, and presents abstractions to read bundled
 * elements out of the underlying content.
 */ class ya {
    constructor(
    /** The reader to read from underlying binary bundle data source. */
    t, e) {
        this.Ic = t, this.serializer = e, 
        /** Cached bundle metadata. */
        this.metadata = new q, 
        /**
         * Internal buffer to hold bundle content, accumulating incomplete element
         * content.
         */
        this.buffer = new Uint8Array, this.Tc = new TextDecoder("utf-8"), 
        // Read the metadata (which is the first element).
        this.Ec().then((t => {
            t && t.ku() ? this.metadata.resolve(t.Nu.metadata) : this.metadata.reject(new Error(`The first element of the bundle is not a metadata, it is\n             ${JSON.stringify(null == t ? void 0 : t.Nu)}`));
        }), (t => this.metadata.reject(t)));
    }
    close() {
        return this.Ic.cancel();
    }
    async getMetadata() {
        return this.metadata.promise;
    }
    async _c() {
        // Makes sure metadata is read before proceeding.
        return await this.getMetadata(), this.Ec();
    }
    /**
     * Reads from the head of internal buffer, and pulling more data from
     * underlying stream if a complete element cannot be found, until an
     * element(including the prefixed length and the JSON string) is found.
     *
     * Once a complete element is read, it is dropped from internal buffer.
     *
     * Returns either the bundled element, or null if we have reached the end of
     * the stream.
     */    async Ec() {
        const t = await this.Ac();
        if (null === t) return null;
        const e = this.Tc.decode(t), n = Number(e);
        isNaN(n) && this.Rc(`length string (${e}) is not valid number`);
        const s = await this.vc(n);
        return new Rc(JSON.parse(s), t.length + n);
    }
    /** First index of '{' from the underlying buffer. */    bc() {
        return this.buffer.findIndex((t => t === "{".charCodeAt(0)));
    }
    /**
     * Reads from the beginning of the internal buffer, until the first '{', and
     * return the content.
     *
     * If reached end of the stream, returns a null.
     */    async Ac() {
        for (;this.bc() < 0; ) {
            if (await this.Pc()) break;
        }
        // Broke out of the loop because underlying stream is closed, and there
        // happens to be no more data to process.
                if (0 === this.buffer.length) return null;
        const t = this.bc();
        // Broke out of the loop because underlying stream is closed, but still
        // cannot find an open bracket.
                t < 0 && this.Rc("Reached the end of bundle when a length string is expected.");
        const e = this.buffer.slice(0, t);
        // Update the internal buffer to drop the read length.
                return this.buffer = this.buffer.slice(t), e;
    }
    /**
     * Reads from a specified position from the internal buffer, for a specified
     * number of bytes, pulling more data from the underlying stream if needed.
     *
     * Returns a string decoded from the read bytes.
     */    async vc(t) {
        for (;this.buffer.length < t; ) {
            await this.Pc() && this.Rc("Reached the end of bundle when more is expected.");
        }
        const e = this.Tc.decode(this.buffer.slice(0, t));
        // Update the internal buffer to drop the read json string.
                return this.buffer = this.buffer.slice(t), e;
    }
    Rc(t) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        throw this.Ic.cancel(), new Error(`Invalid bundle format: ${t}`);
    }
    /**
     * Pulls more data from underlying stream to internal buffer.
     * Returns a boolean indicating whether the stream is finished.
     */    async Pc() {
        const t = await this.Ic.read();
        if (!t.done) {
            const e = new Uint8Array(this.buffer.length + t.value.length);
            e.set(this.buffer), e.set(t.value, this.buffer.length), this.buffer = e;
        }
        return t.done;
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Internal transaction object responsible for accumulating the mutations to
 * perform and the base versions for any documents read.
 */
class pa {
    constructor(t) {
        this.datastore = t, 
        // The version of each document that was read during this transaction.
        this.readVersions = new Map, this.mutations = [], this.committed = !1, 
        /**
         * A deferred usage error that occurred previously in this transaction that
         * will cause the transaction to fail once it actually commits.
         */
        this.lastWriteError = null, 
        /**
         * Set of documents that have been written in the transaction.
         *
         * When there's more than one write to the same key in a transaction, any
         * writes after the first are handled differently.
         */
        this.writtenDocs = new Set;
    }
    async lookup(t) {
        if (this.ensureCommitNotCalled(), this.mutations.length > 0) throw new L(B.INVALID_ARGUMENT, "Firestore transactions require all reads to be executed before all writes.");
        const e = await async function(t, e) {
            const n = F(t), s = xi(n.serializer) + "/documents", i = {
                documents: e.map((t => Vi(n.serializer, t)))
            }, r = await n.fo("BatchGetDocuments", s, i, e.length), o = new Map;
            r.forEach((t => {
                const e = $i(n.serializer, t);
                o.set(e.key.toString(), e);
            }));
            const u = [];
            return e.forEach((t => {
                const e = o.get(t.toString());
                $(!!e), u.push(e);
            })), u;
        }(this.datastore, t);
        return e.forEach((t => this.recordVersion(t))), e;
    }
    set(t, e) {
        this.write(e.toMutation(t, this.precondition(t))), this.writtenDocs.add(t.toString());
    }
    update(t, e) {
        try {
            this.write(e.toMutation(t, this.preconditionForUpdate(t)));
        } catch (t) {
            this.lastWriteError = t;
        }
        this.writtenDocs.add(t.toString());
    }
    delete(t) {
        this.write(new Ws(t, this.precondition(t))), this.writtenDocs.add(t.toString());
    }
    async commit() {
        if (this.ensureCommitNotCalled(), this.lastWriteError) throw this.lastWriteError;
        const t = this.readVersions;
        // For each mutation, note that the doc was written.
                this.mutations.forEach((e => {
            t.delete(e.key.toString());
        })), 
        // For each document that was read but not written to, we want to perform
        // a `verify` operation.
        t.forEach(((t, e) => {
            const n = ct.fromPath(e);
            this.mutations.push(new Hs(n, this.precondition(n)));
        })), await async function(t, e) {
            const n = F(t), s = xi(n.serializer) + "/documents", i = {
                writes: e.map((t => Fi(n.serializer, t)))
            };
            await n.co("Commit", s, i);
        }(this.datastore, this.mutations), this.committed = !0;
    }
    recordVersion(t) {
        let e;
        if (t.isFoundDocument()) e = t.version; else {
            if (!t.isNoDocument()) throw O();
            // Represent a deleted doc using SnapshotVersion.min().
            e = st.min();
        }
        const n = this.readVersions.get(t.key.toString());
        if (n) {
            if (!e.isEqual(n)) 
            // This transaction will fail no matter what.
            throw new L(B.ABORTED, "Document version changed between two reads.");
        } else this.readVersions.set(t.key.toString(), e);
    }
    /**
     * Returns the version of this document when it was read in this transaction,
     * as a precondition, or no precondition if it was not read.
     */    precondition(t) {
        const e = this.readVersions.get(t.toString());
        return !this.writtenDocs.has(t.toString()) && e ? e.isEqual(st.min()) ? Os.exists(!1) : Os.updateTime(e) : Os.none();
    }
    /**
     * Returns the precondition for a document if the operation is an update.
     */    preconditionForUpdate(t) {
        const e = this.readVersions.get(t.toString());
        // The first time a document is written, we want to take into account the
        // read time and existence
                if (!this.writtenDocs.has(t.toString()) && e) {
            if (e.isEqual(st.min())) 
            // The document doesn't exist, so fail the transaction.
            // This has to be validated locally because you can't send a
            // precondition that a document does not exist without changing the
            // semantics of the backend write to be an insert. This is the reverse
            // of what we want, since we want to assert that the document doesn't
            // exist but then send the update and have it fail. Since we can't
            // express that to the backend, we have to validate locally.
            // Note: this can change once we can send separate verify writes in the
            // transaction.
            throw new L(B.INVALID_ARGUMENT, "Can't update a document that doesn't exist.");
            // Document exists, base precondition on document update time.
                        return Os.updateTime(e);
        }
        // Document was not read, so we just use the preconditions for a blind
        // update.
        return Os.exists(!0);
    }
    write(t) {
        this.ensureCommitNotCalled(), this.mutations.push(t);
    }
    ensureCommitNotCalled() {}
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * TransactionRunner encapsulates the logic needed to run and retry transactions
 * with backoff.
 */ class Ia {
    constructor(t, e, n, s, i) {
        this.asyncQueue = t, this.datastore = e, this.options = n, this.updateFunction = s, 
        this.deferred = i, this.Vc = n.maxAttempts, this.Co = new Su(this.asyncQueue, "transaction_retry" /* TimerId.TransactionRetry */);
    }
    /** Runs the transaction and sets the result on deferred. */    run() {
        this.Vc -= 1, this.Sc();
    }
    Sc() {
        this.Co.Ao((async () => {
            const t = new pa(this.datastore), e = this.Dc(t);
            e && e.then((e => {
                this.asyncQueue.enqueueAndForget((() => t.commit().then((() => {
                    this.deferred.resolve(e);
                })).catch((t => {
                    this.Cc(t);
                }))));
            })).catch((t => {
                this.Cc(t);
            }));
        }));
    }
    Dc(t) {
        try {
            const e = this.updateFunction(t);
            return !$t(e) && e.catch && e.then ? e : (this.deferred.reject(Error("Transaction callback must return a Promise")), 
            null);
        } catch (t) {
            // Do not retry errors thrown by user provided updateFunction.
            return this.deferred.reject(t), null;
        }
    }
    Cc(t) {
        this.Vc > 0 && this.xc(t) ? (this.Vc -= 1, this.asyncQueue.enqueueAndForget((() => (this.Sc(), 
        Promise.resolve())))) : this.deferred.reject(t);
    }
    xc(t) {
        if ("FirebaseError" === t.name) {
            // In transactions, the backend will fail outdated reads with FAILED_PRECONDITION and
            // non-matching document versions with ABORTED. These errors should be retried.
            const e = t.code;
            return "aborted" === e || "failed-precondition" === e || "already-exists" === e || !ri(e);
        }
        return !1;
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * FirestoreClient is a top-level class that constructs and owns all of the //
 * pieces of the client SDK architecture. It is responsible for creating the //
 * async queue that is shared by all of the other components in the system. //
 */
class Ta {
    constructor(t, e, 
    /**
     * Asynchronous queue responsible for all of our internal processing. When
     * we get incoming work from the user (via public API) or the network
     * (incoming GRPC messages), we should always schedule onto this queue.
     * This ensures all of our work is properly serialized (e.g. we don't
     * start processing a new operation while the previous one is waiting for
     * an async I/O to complete).
     */
    n, s) {
        this.authCredentials = t, this.appCheckCredentials = e, this.asyncQueue = n, this.databaseInfo = s, 
        this.user = b.UNAUTHENTICATED, this.clientId = Z.A(), this.authCredentialListener = () => Promise.resolve(), 
        this.appCheckCredentialListener = () => Promise.resolve(), this.authCredentials.start(n, (async t => {
            C("FirestoreClient", "Received user=", t.uid), await this.authCredentialListener(t), 
            this.user = t;
        })), this.appCheckCredentials.start(n, (t => (C("FirestoreClient", "Received new app check token=", t), 
        this.appCheckCredentialListener(t, this.user))));
    }
    async getConfiguration() {
        return {
            asyncQueue: this.asyncQueue,
            databaseInfo: this.databaseInfo,
            clientId: this.clientId,
            authCredentials: this.authCredentials,
            appCheckCredentials: this.appCheckCredentials,
            initialUser: this.user,
            maxConcurrentLimboResolutions: 100
        };
    }
    setCredentialChangeListener(t) {
        this.authCredentialListener = t;
    }
    setAppCheckTokenChangeListener(t) {
        this.appCheckCredentialListener = t;
    }
    /**
     * Checks that the client has not been terminated. Ensures that other methods on //
     * this class cannot be called after the client is terminated. //
     */    verifyNotTerminated() {
        if (this.asyncQueue.isShuttingDown) throw new L(B.FAILED_PRECONDITION, "The client has already been terminated.");
    }
    terminate() {
        this.asyncQueue.enterRestrictedMode();
        const t = new q;
        return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async () => {
            try {
                this._onlineComponents && await this._onlineComponents.terminate(), this._offlineComponents && await this._offlineComponents.terminate(), 
                // The credentials provider must be terminated after shutting down the
                // RemoteStore as it will prevent the RemoteStore from retrieving auth
                // tokens.
                this.authCredentials.shutdown(), this.appCheckCredentials.shutdown(), t.resolve();
            } catch (e) {
                const n = fc(e, "Failed to shutdown persistence");
                t.reject(n);
            }
        })), t.promise;
    }
}

async function Ea(t, e) {
    t.asyncQueue.verifyOperationInProgress(), C("FirestoreClient", "Initializing OfflineComponentProvider");
    const n = await t.getConfiguration();
    await e.initialize(n);
    let s = n.initialUser;
    t.setCredentialChangeListener((async t => {
        s.isEqual(t) || (await Wo(e.localStore, t), s = t);
    })), 
    // When a user calls clearPersistence() in one client, all other clients
    // need to be terminated to allow the delete to succeed.
    e.persistence.setDatabaseDeletedListener((() => t.terminate())), t._offlineComponents = e;
}

async function Aa(t, e) {
    t.asyncQueue.verifyOperationInProgress();
    const n = await va(t);
    C("FirestoreClient", "Initializing OnlineComponentProvider");
    const s = await t.getConfiguration();
    await e.initialize(n, s), 
    // The CredentialChangeListener of the online component provider takes
    // precedence over the offline component provider.
    t.setCredentialChangeListener((t => uc(e.remoteStore, t))), t.setAppCheckTokenChangeListener(((t, n) => uc(e.remoteStore, n))), 
    t._onlineComponents = e;
}

/**
 * Decides whether the provided error allows us to gracefully disable
 * persistence (as opposed to crashing the client).
 */ function Ra(t) {
    return "FirebaseError" === t.name ? t.code === B.FAILED_PRECONDITION || t.code === B.UNIMPLEMENTED : !("undefined" != typeof DOMException && t instanceof DOMException) || (
    // When the browser is out of quota we could get either quota exceeded
    // or an aborted error depending on whether the error happened during
    // schema migration.
    22 === t.code || 20 === t.code || 
    // Firefox Private Browsing mode disables IndexedDb and returns
    // INVALID_STATE for any usage.
    11 === t.code);
}

async function va(t) {
    if (!t._offlineComponents) if (t._uninitializedComponentsProvider) {
        C("FirestoreClient", "Using user provided OfflineComponentProvider");
        try {
            await Ea(t, t._uninitializedComponentsProvider._offline);
        } catch (e) {
            const n = e;
            if (!Ra(n)) throw n;
            N("Error using user provided cache. Falling back to memory cache: " + n), await Ea(t, new fa);
        }
    } else C("FirestoreClient", "Using default OfflineComponentProvider"), await Ea(t, new fa);
    return t._offlineComponents;
}

async function ba(t) {
    return t._onlineComponents || (t._uninitializedComponentsProvider ? (C("FirestoreClient", "Using user provided OnlineComponentProvider"), 
    await Aa(t, t._uninitializedComponentsProvider._online)) : (C("FirestoreClient", "Using default OnlineComponentProvider"), 
    await Aa(t, new _a))), t._onlineComponents;
}

function Pa(t) {
    return va(t).then((t => t.persistence));
}

function Va(t) {
    return va(t).then((t => t.localStore));
}

function Sa(t) {
    return ba(t).then((t => t.remoteStore));
}

function Da(t) {
    return ba(t).then((t => t.syncEngine));
}

function Ca(t) {
    return ba(t).then((t => t.datastore));
}

async function xa(t) {
    const e = await ba(t), n = e.eventManager;
    return n.onListen = kc.bind(null, e.syncEngine), n.onUnlisten = $c.bind(null, e.syncEngine), 
    n;
}

/** Enables the network connection and re-enqueues all pending operations. */ function Na(t) {
    return t.asyncQueue.enqueue((async () => {
        const e = await Pa(t), n = await Sa(t);
        return e.setNetworkEnabled(!0), function(t) {
            const e = F(t);
            return e.du.delete(0 /* OfflineCause.UserDisabled */), Mu(e);
        }(n);
    }));
}

/** Disables the network connection. Pending operations will not complete. */ function ka(t) {
    return t.asyncQueue.enqueue((async () => {
        const e = await Pa(t), n = await Sa(t);
        return e.setNetworkEnabled(!1), async function(t) {
            const e = F(t);
            e.du.add(0 /* OfflineCause.UserDisabled */), await Fu(e), 
            // Set the OnlineState to Offline so get()s return from cache, etc.
            e.mu.set("Offline" /* OnlineState.Offline */);
        }(n);
    }));
}

/**
 * Returns a Promise that resolves when all writes that were pending at the time
 * this method was called received server acknowledgement. An acknowledgement
 * can be either acceptance or rejection.
 */ function Oa(t, e) {
    const n = new q;
    return t.asyncQueue.enqueueAndForget((async () => async function(t, e, n) {
        try {
            const s = await function(t, e) {
                const n = F(t);
                return n.persistence.runTransaction("read document", "readonly", (t => n.localDocuments.getDocument(t, e)));
            }(t, e);
            s.isFoundDocument() ? n.resolve(s) : s.isNoDocument() ? n.resolve(null) : n.reject(new L(B.UNAVAILABLE, "Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"));
        } catch (t) {
            const s = fc(t, `Failed to get document '${e} from cache`);
            n.reject(s);
        }
    }
    /**
 * Retrieves a latency-compensated document from the backend via a
 * SnapshotListener.
 */ (await Va(t), e, n))), n.promise;
}

function $a(t, e, n = {}) {
    const s = new q;
    return t.asyncQueue.enqueueAndForget((async () => function(t, e, n, s, i) {
        const r = new ga({
            next: r => {
                // Remove query first before passing event to user to avoid
                // user actions affecting the now stale query.
                e.enqueueAndForget((() => pc(t, o)));
                const u = r.docs.has(n);
                !u && r.fromCache ? 
                // TODO(dimond): If we're online and the document doesn't
                // exist then we resolve with a doc.exists set to false. If
                // we're offline however, we reject the Promise in this
                // case. Two options: 1) Cache the negative response from
                // the server so we can deliver that even when you're
                // offline 2) Actually reject the Promise in the online case
                // if the document doesn't exist.
                i.reject(new L(B.UNAVAILABLE, "Failed to get document because the client is offline.")) : u && r.fromCache && s && "server" === s.source ? i.reject(new L(B.UNAVAILABLE, 'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')) : i.resolve(r);
            },
            error: t => i.reject(t)
        }), o = new Ac(qn(n.path), r, {
            includeMetadataChanges: !0,
            xu: !0
        });
        return yc(t, o);
    }(await xa(t), t.asyncQueue, e, n, s))), s.promise;
}

function Ma(t, e) {
    const n = new q;
    return t.asyncQueue.enqueueAndForget((async () => async function(t, e, n) {
        try {
            const s = await nu(t, e, 
            /* usePreviousResults= */ !0), i = new Dc(e, s.Wi), r = i.zu(s.documents), o = i.applyChanges(r, 
            /* updateLimboDocuments= */ !1);
            n.resolve(o.snapshot);
        } catch (t) {
            const s = fc(t, `Failed to execute query '${e} against cache`);
            n.reject(s);
        }
    }
    /**
 * Retrieves a latency-compensated query snapshot from the backend via a
 * SnapshotListener.
 */ (await Va(t), e, n))), n.promise;
}

function Fa(t, e, n = {}) {
    const s = new q;
    return t.asyncQueue.enqueueAndForget((async () => function(t, e, n, s, i) {
        const r = new ga({
            next: n => {
                // Remove query first before passing event to user to avoid
                // user actions affecting the now stale query.
                e.enqueueAndForget((() => pc(t, o))), n.fromCache && "server" === s.source ? i.reject(new L(B.UNAVAILABLE, 'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')) : i.resolve(n);
            },
            error: t => i.reject(t)
        }), o = new Ac(n, r, {
            includeMetadataChanges: !0,
            xu: !0
        });
        return yc(t, o);
    }(await xa(t), t.asyncQueue, e, n, s))), s.promise;
}

function Ba(t, e) {
    const n = new ga(e);
    return t.asyncQueue.enqueueAndForget((async () => function(t, e) {
        F(t).Au.add(e), 
        // Immediately fire an initial event, indicating all existing listeners
        // are in-sync.
        e.next();
    }(await xa(t), n))), () => {
        n.yc(), t.asyncQueue.enqueueAndForget((async () => function(t, e) {
            F(t).Au.delete(e);
        }(await xa(t), n)));
    };
}

/**
 * Takes an updateFunction in which a set of reads and writes can be performed
 * atomically. In the updateFunction, the client can read and write values
 * using the supplied transaction object. After the updateFunction, all
 * changes will be committed. If a retryable error occurs (ex: some other
 * client has changed any of the data referenced), then the updateFunction
 * will be called again after a backoff. If the updateFunction still fails
 * after all retries, then the transaction will be rejected.
 *
 * The transaction object passed to the updateFunction contains methods for
 * accessing documents and collections. Unlike other datastore access, data
 * accessed with the transaction will not reflect local changes that have not
 * been committed. For this reason, it is required that all reads are
 * performed before any writes. Transactions must be performed while online.
 */ function La(t, e, n, s) {
    const i = function(t, e) {
        let n;
        n = "string" == typeof t ? (new TextEncoder).encode(t) : t;
        return function(t, e) {
            return new ya(t, e);
        }(function(t, e) {
            if (t instanceof Uint8Array) return ma(t, e);
            if (t instanceof ArrayBuffer) return ma(new Uint8Array(t), e);
            if (t instanceof ReadableStream) return t.getReader();
            throw new Error("Source of `toByteStreamReader` has to be a ArrayBuffer or ReadableStream");
        }
        /**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
        /**
 * An instance of the Platform's 'TextEncoder' implementation.
 */ (n), e);
    }(n, Vu(e));
    t.asyncQueue.enqueueAndForget((async () => {
        la(await Da(t), i, s);
    }));
}

function qa(t, e) {
    return t.asyncQueue.enqueue((async () => function(t, e) {
        const n = F(t);
        return n.persistence.runTransaction("Get named query", "readonly", (t => n.xs.getNamedQuery(t, e)));
    }(await Va(t), e)));
}

function Ua(t, e) {
    return t.asyncQueue.enqueue((async () => async function(t, e) {
        const n = F(t), s = n.indexManager, i = [];
        return n.persistence.runTransaction("Configure indexes", "readwrite", (t => s.getFieldIndexes(t).next((n => 
        /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
        /**
 * Compares two array for equality using comparator. The method computes the
 * intersection and invokes `onAdd` for every element that is in `after` but not
 * `before`. `onRemove` is invoked for every element in `before` but missing
 * from `after`.
 *
 * The method creates a copy of both `before` and `after` and runs in O(n log
 * n), where n is the size of the two lists.
 *
 * @param before - The elements that exist in the original array.
 * @param after - The elements to diff against the original array.
 * @param comparator - The comparator for the elements in before and after.
 * @param onAdd - A function to invoke for every element that is part of `
 * after` but not `before`.
 * @param onRemove - A function to invoke for every element that is part of
 * `before` but not `after`.
 */
        function(t, e, n, s, i) {
            t = [ ...t ], e = [ ...e ], t.sort(n), e.sort(n);
            const r = t.length, o = e.length;
            let u = 0, c = 0;
            for (;u < o && c < r; ) {
                const r = n(t[c], e[u]);
                r < 0 ? 
                // The element was removed if the next element in our ordered
                // walkthrough is only in `before`.
                i(t[c++]) : r > 0 ? 
                // The element was added if the next element in our ordered walkthrough
                // is only in `after`.
                s(e[u++]) : (u++, c++);
            }
            for (;u < o; ) s(e[u++]);
            for (;c < r; ) i(t[c++]);
        }(n, e, ft, (e => {
            i.push(s.addFieldIndex(t, e));
        }), (e => {
            i.push(s.deleteFieldIndex(t, e));
        })))).next((() => At.waitFor(i)))));
    }
    /**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
    // The format of the LocalStorage key that stores the client state is:
    //     firestore_clients_<persistence_prefix>_<instance_key>
    (await Va(t), e)));
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Ka = new Map;

/**
 * An instance map that ensures only one Datastore exists per Firestore
 * instance.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Ga(t, e, n) {
    if (!n) throw new L(B.INVALID_ARGUMENT, `Function ${t}() cannot be called with an empty ${e}.`);
}

/**
 * Validates that two boolean options are not set at the same time.
 * @internal
 */ function Qa(t, e, n, s) {
    if (!0 === e && !0 === s) throw new L(B.INVALID_ARGUMENT, `${t} and ${n} cannot be used together.`);
}

/**
 * Validates that `path` refers to a document (indicated by the fact it contains
 * an even numbers of segments).
 */ function za(t) {
    if (!ct.isDocumentKey(t)) throw new L(B.INVALID_ARGUMENT, `Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`);
}

/**
 * Validates that `path` refers to a collection (indicated by the fact it
 * contains an odd numbers of segments).
 */ function ja(t) {
    if (ct.isDocumentKey(t)) throw new L(B.INVALID_ARGUMENT, `Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`);
}

/**
 * Returns true if it's a non-null object without a custom prototype
 * (i.e. excludes Array, Date, etc.).
 */
/** Returns a string describing the type / value of the provided input. */
function Wa(t) {
    if (void 0 === t) return "undefined";
    if (null === t) return "null";
    if ("string" == typeof t) return t.length > 20 && (t = `${t.substring(0, 20)}...`), 
    JSON.stringify(t);
    if ("number" == typeof t || "boolean" == typeof t) return "" + t;
    if ("object" == typeof t) {
        if (t instanceof Array) return "an array";
        {
            const e = 
            /** try to get the constructor name for an object. */
            function(t) {
                if (t.constructor) return t.constructor.name;
                return null;
            }
            /**
 * Casts `obj` to `T`, optionally unwrapping Compat types to expose the
 * underlying instance. Throws if  `obj` is not an instance of `T`.
 *
 * This cast is used in the Lite and Full SDK to verify instance types for
 * arguments passed to the public API.
 * @internal
 */ (t);
            return e ? `a custom ${e} object` : "an object";
        }
    }
    return "function" == typeof t ? "a function" : O();
}

function Ha(t, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
e) {
    if ("_delegate" in t && (
    // Unwrap Compat types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t = t._delegate), !(t instanceof e)) {
        if (e.name === t.constructor.name) throw new L(B.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
        {
            const n = Wa(t);
            throw new L(B.INVALID_ARGUMENT, `Expected type '${e.name}', but it was: ${n}`);
        }
    }
    return t;
}

function Ja(t, e) {
    if (e <= 0) throw new L(B.INVALID_ARGUMENT, `Function ${t}() requires a positive number, but it was: ${e}.`);
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// settings() defaults:
/**
 * A concrete type describing all the values that can be applied via a
 * user-supplied `FirestoreSettings` object. This is a separate type so that
 * defaults can be supplied and the value can be checked for equality.
 */
class Ya {
    constructor(t) {
        var e;
        if (void 0 === t.host) {
            if (void 0 !== t.ssl) throw new L(B.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
            this.host = "firestore.googleapis.com", this.ssl = true;
        } else this.host = t.host, this.ssl = null === (e = t.ssl) || void 0 === e || e;
        if (this.credentials = t.credentials, this.ignoreUndefinedProperties = !!t.ignoreUndefinedProperties, 
        this.cache = t.localCache, void 0 === t.cacheSizeBytes) this.cacheSizeBytes = 41943040; else {
            if (-1 !== t.cacheSizeBytes && t.cacheSizeBytes < 1048576) throw new L(B.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
            this.cacheSizeBytes = t.cacheSizeBytes;
        }
        this.experimentalForceLongPolling = !!t.experimentalForceLongPolling, this.experimentalAutoDetectLongPolling = !!t.experimentalAutoDetectLongPolling, 
        this.useFetchStreams = !!t.useFetchStreams, Qa("experimentalForceLongPolling", t.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", t.experimentalAutoDetectLongPolling);
    }
    isEqual(t) {
        return this.host === t.host && this.ssl === t.ssl && this.credentials === t.credentials && this.cacheSizeBytes === t.cacheSizeBytes && this.experimentalForceLongPolling === t.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === t.experimentalAutoDetectLongPolling && this.ignoreUndefinedProperties === t.ignoreUndefinedProperties && this.useFetchStreams === t.useFetchStreams;
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * The Cloud Firestore service interface.
 *
 * Do not call this constructor directly. Instead, use {@link (getFirestore:1)}.
 */ class Za {
    /** @hideconstructor */
    constructor(t, e, n, s) {
        this._authCredentials = t, this._appCheckCredentials = e, this._databaseId = n, 
        this._app = s, 
        /**
         * Whether it's a Firestore or Firestore Lite instance.
         */
        this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new Ya({}), 
        this._settingsFrozen = !1;
    }
    /**
     * The {@link @firebase/app#FirebaseApp} associated with this `Firestore` service
     * instance.
     */    get app() {
        if (!this._app) throw new L(B.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
        return this._app;
    }
    get _initialized() {
        return this._settingsFrozen;
    }
    get _terminated() {
        return void 0 !== this._terminateTask;
    }
    _setSettings(t) {
        if (this._settingsFrozen) throw new L(B.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
        this._settings = new Ya(t), void 0 !== t.credentials && (this._authCredentials = function(t) {
            if (!t) return new K;
            switch (t.type) {
              case "firstParty":
                return new j(t.sessionIndex || "0", t.iamToken || null, t.authTokenFactory || null);

              case "provider":
                return t.client;

              default:
                throw new L(B.INVALID_ARGUMENT, "makeAuthCredentialsProvider failed due to invalid credential type");
            }
        }(t.credentials));
    }
    _getSettings() {
        return this._settings;
    }
    _freezeSettings() {
        return this._settingsFrozen = !0, this._settings;
    }
    _delete() {
        return this._terminateTask || (this._terminateTask = this._terminate()), this._terminateTask;
    }
    /** Returns a JSON-serializable representation of this `Firestore` instance. */    toJSON() {
        return {
            app: this._app,
            databaseId: this._databaseId,
            settings: this._settings
        };
    }
    /**
     * Terminates all components used by this client. Subclasses can override
     * this method to clean up their own dependencies, but must also call this
     * method.
     *
     * Only ever called once.
     */    _terminate() {
        /**
 * Removes all components associated with the provided instance. Must be called
 * when the `Firestore` instance is terminated.
 */
        return function(t) {
            const e = Ka.get(t);
            e && (C("ComponentProvider", "Removing Datastore"), Ka.delete(t), e.terminate());
        }(this), Promise.resolve();
    }
}

/**
 * Modify this instance to communicate with the Cloud Firestore emulator.
 *
 * Note: This must be called before this instance has been used to do any
 * operations.
 *
 * @param firestore - The `Firestore` instance to configure to connect to the
 * emulator.
 * @param host - the emulator host (ex: localhost).
 * @param port - the emulator port (ex: 9000).
 * @param options.mockUserToken - the mock auth token to use for unit testing
 * Security Rules.
 */ function Xa(t, e, n, s = {}) {
    var i;
    const r = (t = Ha(t, Za))._getSettings();
    if ("firestore.googleapis.com" !== r.host && r.host !== e && N("Host has been set in both settings() and useEmulator(), emulator host will be used"), 
    t._setSettings(Object.assign(Object.assign({}, r), {
        host: `${e}:${n}`,
        ssl: !1
    })), s.mockUserToken) {
        let e, n;
        if ("string" == typeof s.mockUserToken) e = s.mockUserToken, n = b.MOCK_USER; else {
            // Let createMockUserToken validate first (catches common mistakes like
            // invalid field "uid" and missing field "sub" / "user_id".)
            e = createMockUserToken(s.mockUserToken, null === (i = t._app) || void 0 === i ? void 0 : i.options.projectId);
            const r = s.mockUserToken.sub || s.mockUserToken.user_id;
            if (!r) throw new L(B.INVALID_ARGUMENT, "mockUserToken must contain 'sub' or 'user_id' field!");
            n = new b(r);
        }
        t._authCredentials = new G(new U(e, n));
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A `DocumentReference` refers to a document location in a Firestore database
 * and can be used to write, read, or listen to the location. The document at
 * the referenced location may or may not exist.
 */ class th {
    /** @hideconstructor */
    constructor(t, 
    /**
     * If provided, the `FirestoreDataConverter` associated with this instance.
     */
    e, n) {
        this.converter = e, this._key = n, 
        /** The type of this Firestore reference. */
        this.type = "document", this.firestore = t;
    }
    get _path() {
        return this._key.path;
    }
    /**
     * The document's identifier within its collection.
     */    get id() {
        return this._key.path.lastSegment();
    }
    /**
     * A string representing the path of the referenced document (relative
     * to the root of the database).
     */    get path() {
        return this._key.path.canonicalString();
    }
    /**
     * The collection this `DocumentReference` belongs to.
     */    get parent() {
        return new nh(this.firestore, this.converter, this._key.path.popLast());
    }
    withConverter(t) {
        return new th(this.firestore, t, this._key);
    }
}

/**
 * A `Query` refers to a query which you can read or listen to. You can also
 * construct refined `Query` objects by adding filters and ordering.
 */ class eh {
    // This is the lite version of the Query class in the main SDK.
    /** @hideconstructor protected */
    constructor(t, 
    /**
     * If provided, the `FirestoreDataConverter` associated with this instance.
     */
    e, n) {
        this.converter = e, this._query = n, 
        /** The type of this Firestore reference. */
        this.type = "query", this.firestore = t;
    }
    withConverter(t) {
        return new eh(this.firestore, t, this._query);
    }
}

/**
 * A `CollectionReference` object can be used for adding documents, getting
 * document references, and querying for documents (using {@link (query:1)}).
 */ class nh extends eh {
    /** @hideconstructor */
    constructor(t, e, n) {
        super(t, e, qn(n)), this._path = n, 
        /** The type of this Firestore reference. */
        this.type = "collection";
    }
    /** The collection's identifier. */    get id() {
        return this._query.path.lastSegment();
    }
    /**
     * A string representing the path of the referenced collection (relative
     * to the root of the database).
     */    get path() {
        return this._query.path.canonicalString();
    }
    /**
     * A reference to the containing `DocumentReference` if this is a
     * subcollection. If this isn't a subcollection, the reference is null.
     */    get parent() {
        const t = this._path.popLast();
        return t.isEmpty() ? null : new th(this.firestore, 
        /* converter= */ null, new ct(t));
    }
    withConverter(t) {
        return new nh(this.firestore, t, this._path);
    }
}

function sh(t, e, ...n) {
    if (t = getModularInstance(t), Ga("collection", "path", e), t instanceof Za) {
        const s = rt.fromString(e, ...n);
        return ja(s), new nh(t, /* converter= */ null, s);
    }
    {
        if (!(t instanceof th || t instanceof nh)) throw new L(B.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
        const s = t._path.child(rt.fromString(e, ...n));
        return ja(s), new nh(t.firestore, 
        /* converter= */ null, s);
    }
}

// TODO(firestorelite): Consider using ErrorFactory -
// https://github.com/firebase/firebase-js-sdk/blob/0131e1f/packages/util/src/errors.ts#L106
/**
 * Creates and returns a new `Query` instance that includes all documents in the
 * database that are contained in a collection or subcollection with the
 * given `collectionId`.
 *
 * @param firestore - A reference to the root `Firestore` instance.
 * @param collectionId - Identifies the collections to query over. Every
 * collection or subcollection with this ID as the last segment of its path
 * will be included. Cannot contain a slash.
 * @returns The created `Query`.
 */ function ih(t, e) {
    if (t = Ha(t, Za), Ga("collectionGroup", "collection id", e), e.indexOf("/") >= 0) throw new L(B.INVALID_ARGUMENT, `Invalid collection ID '${e}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);
    return new eh(t, 
    /* converter= */ null, function(t) {
        return new Bn(rt.emptyPath(), t);
    }(e));
}

function rh(t, e, ...n) {
    if (t = getModularInstance(t), 
    // We allow omission of 'pathString' but explicitly prohibit passing in both
    // 'undefined' and 'null'.
    1 === arguments.length && (e = Z.A()), Ga("doc", "path", e), t instanceof Za) {
        const s = rt.fromString(e, ...n);
        return za(s), new th(t, 
        /* converter= */ null, new ct(s));
    }
    {
        if (!(t instanceof th || t instanceof nh)) throw new L(B.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
        const s = t._path.child(rt.fromString(e, ...n));
        return za(s), new th(t.firestore, t instanceof nh ? t.converter : null, new ct(s));
    }
}

/**
 * Returns true if the provided references are equal.
 *
 * @param left - A reference to compare.
 * @param right - A reference to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */ function oh(t, e) {
    return t = getModularInstance(t), e = getModularInstance(e), (t instanceof th || t instanceof nh) && (e instanceof th || e instanceof nh) && (t.firestore === e.firestore && t.path === e.path && t.converter === e.converter);
}

/**
 * Returns true if the provided queries point to the same collection and apply
 * the same constraints.
 *
 * @param left - A `Query` to compare.
 * @param right - A `Query` to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */ function uh(t, e) {
    return t = getModularInstance(t), e = getModularInstance(e), t instanceof eh && e instanceof eh && (t.firestore === e.firestore && Jn(t._query, e._query) && t.converter === e.converter);
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class ch {
    constructor() {
        // The last promise in the queue.
        this.Nc = Promise.resolve(), 
        // A list of retryable operations. Retryable operations are run in order and
        // retried with backoff.
        this.kc = [], 
        // Is this AsyncQueue being shut down? Once it is set to true, it will not
        // be changed again.
        this.Oc = !1, 
        // Operations scheduled to be queued in the future. Operations are
        // automatically removed after they are run or canceled.
        this.$c = [], 
        // visible for testing
        this.Mc = null, 
        // Flag set while there's an outstanding AsyncQueue operation, used for
        // assertion sanity-checks.
        this.Fc = !1, 
        // Enabled during shutdown on Safari to prevent future access to IndexedDB.
        this.Bc = !1, 
        // List of TimerIds to fast-forward delays for.
        this.Lc = [], 
        // Backoff timer used to schedule retries for retryable operations
        this.Co = new Su(this, "async_queue_retry" /* TimerId.AsyncQueueRetry */), 
        // Visibility handler that triggers an immediate retry of all retryable
        // operations. Meant to speed up recovery when we regain file system access
        // after page comes into foreground.
        this.qc = () => {
            const t = Pu();
            t && C("AsyncQueue", "Visibility state changed to " + t.visibilityState), this.Co.vo();
        };
        const t = Pu();
        t && "function" == typeof t.addEventListener && t.addEventListener("visibilitychange", this.qc);
    }
    get isShuttingDown() {
        return this.Oc;
    }
    /**
     * Adds a new operation to the queue without waiting for it to complete (i.e.
     * we ignore the Promise result).
     */    enqueueAndForget(t) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.enqueue(t);
    }
    enqueueAndForgetEvenWhileRestricted(t) {
        this.Uc(), 
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.Kc(t);
    }
    enterRestrictedMode(t) {
        if (!this.Oc) {
            this.Oc = !0, this.Bc = t || !1;
            const e = Pu();
            e && "function" == typeof e.removeEventListener && e.removeEventListener("visibilitychange", this.qc);
        }
    }
    enqueue(t) {
        if (this.Uc(), this.Oc) 
        // Return a Promise which never resolves.
        return new Promise((() => {}));
        // Create a deferred Promise that we can return to the callee. This
        // allows us to return a "hanging Promise" only to the callee and still
        // advance the queue even when the operation is not run.
                const e = new q;
        return this.Kc((() => this.Oc && this.Bc ? Promise.resolve() : (t().then(e.resolve, e.reject), 
        e.promise))).then((() => e.promise));
    }
    enqueueRetryable(t) {
        this.enqueueAndForget((() => (this.kc.push(t), this.Gc())));
    }
    /**
     * Runs the next operation from the retryable queue. If the operation fails,
     * reschedules with backoff.
     */    async Gc() {
        if (0 !== this.kc.length) {
            try {
                await this.kc[0](), this.kc.shift(), this.Co.reset();
            } catch (t) {
                if (!Vt(t)) throw t;
 // Failure will be handled by AsyncQueue
                                C("AsyncQueue", "Operation failed with retryable error: " + t);
            }
            this.kc.length > 0 && 
            // If there are additional operations, we re-schedule `retryNextOp()`.
            // This is necessary to run retryable operations that failed during
            // their initial attempt since we don't know whether they are already
            // enqueued. If, for example, `op1`, `op2`, `op3` are enqueued and `op1`
            // needs to  be re-run, we will run `op1`, `op1`, `op2` using the
            // already enqueued calls to `retryNextOp()`. `op3()` will then run in the
            // call scheduled here.
            // Since `backoffAndRun()` cancels an existing backoff and schedules a
            // new backoff on every call, there is only ever a single additional
            // operation in the queue.
            this.Co.Ao((() => this.Gc()));
        }
    }
    Kc(t) {
        const e = this.Nc.then((() => (this.Fc = !0, t().catch((t => {
            this.Mc = t, this.Fc = !1;
            const e = 
            /**
 * Chrome includes Error.message in Error.stack. Other browsers do not.
 * This returns expected output of message + stack when available.
 * @param error - Error or FirestoreError
 */
            function(t) {
                let e = t.message || "";
                t.stack && (e = t.stack.includes(t.message) ? t.stack : t.message + "\n" + t.stack);
                return e;
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ (t);
            // Re-throw the error so that this.tail becomes a rejected Promise and
            // all further attempts to chain (via .then) will just short-circuit
            // and return the rejected Promise.
            throw x("INTERNAL UNHANDLED ERROR: ", e), t;
        })).then((t => (this.Fc = !1, t))))));
        return this.Nc = e, e;
    }
    enqueueAfterDelay(t, e, n) {
        this.Uc(), 
        // Fast-forward delays for timerIds that have been overriden.
        this.Lc.indexOf(t) > -1 && (e = 0);
        const s = lc.createAndSchedule(this, t, e, n, (t => this.Qc(t)));
        return this.$c.push(s), s;
    }
    Uc() {
        this.Mc && O();
    }
    verifyOperationInProgress() {}
    /**
     * Waits until all currently queued tasks are finished executing. Delayed
     * operations are not run.
     */    async zc() {
        // Operations in the queue prior to draining may have enqueued additional
        // operations. Keep draining the queue until the tail is no longer advanced,
        // which indicates that no more new operations were enqueued and that all
        // operations were executed.
        let t;
        do {
            t = this.Nc, await t;
        } while (t !== this.Nc);
    }
    /**
     * For Tests: Determine if a delayed operation with a particular TimerId
     * exists.
     */    jc(t) {
        for (const e of this.$c) if (e.timerId === t) return !0;
        return !1;
    }
    /**
     * For Tests: Runs some or all delayed operations early.
     *
     * @param lastTimerId - Delayed operations up to and including this TimerId
     * will be drained. Pass TimerId.All to run all delayed operations.
     * @returns a Promise that resolves once all operations have been run.
     */    Wc(t) {
        // Note that draining may generate more delayed ops, so we do that first.
        return this.zc().then((() => {
            // Run ops in the same order they'd run if they ran naturally.
            this.$c.sort(((t, e) => t.targetTimeMs - e.targetTimeMs));
            for (const e of this.$c) if (e.skipDelay(), "all" /* TimerId.All */ !== t && e.timerId === t) break;
            return this.zc();
        }));
    }
    /**
     * For Tests: Skip all subsequent delays for a timer id.
     */    Hc(t) {
        this.Lc.push(t);
    }
    /** Called once a DelayedOperation is run or canceled. */    Qc(t) {
        // NOTE: indexOf / slice are O(n), but delayedOperations is expected to be small.
        const e = this.$c.indexOf(t);
        this.$c.splice(e, 1);
    }
}

function ah(t) {
    /**
 * Returns true if obj is an object and contains at least one of the specified
 * methods.
 */
    return function(t, e) {
        if ("object" != typeof t || null === t) return !1;
        const n = t;
        for (const t of e) if (t in n && "function" == typeof n[t]) return !0;
        return !1;
    }
    /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
    /**
 * Represents the task of loading a Firestore bundle. It provides progress of bundle
 * loading, as well as task completion and error events.
 *
 * The API is compatible with `Promise<LoadBundleTaskProgress>`.
 */ (t, [ "next", "error", "complete" ]);
}

class hh {
    constructor() {
        this._progressObserver = {}, this._taskCompletionResolver = new q, this._lastProgress = {
            taskState: "Running",
            totalBytes: 0,
            totalDocuments: 0,
            bytesLoaded: 0,
            documentsLoaded: 0
        };
    }
    /**
     * Registers functions to listen to bundle loading progress events.
     * @param next - Called when there is a progress update from bundle loading. Typically `next` calls occur
     *   each time a Firestore document is loaded from the bundle.
     * @param error - Called when an error occurs during bundle loading. The task aborts after reporting the
     *   error, and there should be no more updates after this.
     * @param complete - Called when the loading task is complete.
     */    onProgress(t, e, n) {
        this._progressObserver = {
            next: t,
            error: e,
            complete: n
        };
    }
    /**
     * Implements the `Promise<LoadBundleTaskProgress>.catch` interface.
     *
     * @param onRejected - Called when an error occurs during bundle loading.
     */    catch(t) {
        return this._taskCompletionResolver.promise.catch(t);
    }
    /**
     * Implements the `Promise<LoadBundleTaskProgress>.then` interface.
     *
     * @param onFulfilled - Called on the completion of the loading task with a final `LoadBundleTaskProgress` update.
     *   The update will always have its `taskState` set to `"Success"`.
     * @param onRejected - Called when an error occurs during bundle loading.
     */    then(t, e) {
        return this._taskCompletionResolver.promise.then(t, e);
    }
    /**
     * Notifies all observers that bundle loading has completed, with a provided
     * `LoadBundleTaskProgress` object.
     *
     * @private
     */    _completeWith(t) {
        this._updateProgress(t), this._progressObserver.complete && this._progressObserver.complete(), 
        this._taskCompletionResolver.resolve(t);
    }
    /**
     * Notifies all observers that bundle loading has failed, with a provided
     * `Error` as the reason.
     *
     * @private
     */    _failWith(t) {
        this._lastProgress.taskState = "Error", this._progressObserver.next && this._progressObserver.next(this._lastProgress), 
        this._progressObserver.error && this._progressObserver.error(t), this._taskCompletionResolver.reject(t);
    }
    /**
     * Notifies a progress update of loading a bundle.
     * @param progress - The new progress.
     *
     * @private
     */    _updateProgress(t) {
        this._lastProgress = t, this._progressObserver.next && this._progressObserver.next(t);
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Constant used to indicate the LRU garbage collection should be disabled.
 * Set this value as the `cacheSizeBytes` on the settings passed to the
 * {@link Firestore} instance.
 */ const lh = -1;

/**
 * The Cloud Firestore service interface.
 *
 * Do not call this constructor directly. Instead, use {@link (getFirestore:1)}.
 */ class fh extends Za {
    /** @hideconstructor */
    constructor(t, e, n, s) {
        super(t, e, n, s), 
        /**
         * Whether it's a {@link Firestore} or Firestore Lite instance.
         */
        this.type = "firestore", this._queue = new ch, this._persistenceKey = (null == s ? void 0 : s.name) || "[DEFAULT]";
    }
    _terminate() {
        return this._firestoreClient || 
        // The client must be initialized to ensure that all subsequent API
        // usage throws an exception.
        mh(this), this._firestoreClient.terminate();
    }
}

/**
 * Initializes a new instance of {@link Firestore} with the provided settings.
 * Can only be called before any other function, including
 * {@link (getFirestore:1)}. If the custom settings are empty, this function is
 * equivalent to calling {@link (getFirestore:1)}.
 *
 * @param app - The {@link @firebase/app#FirebaseApp} with which the {@link Firestore} instance will
 * be associated.
 * @param settings - A settings object to configure the {@link Firestore} instance.
 * @param databaseId - The name of database.
 * @returns A newly initialized {@link Firestore} instance.
 */ function dh(t, e, n) {
    n || (n = "(default)");
    const s = _getProvider(t, "firestore");
    if (s.isInitialized(n)) {
        const t = s.getImmediate({
            identifier: n
        }), i = s.getOptions(n);
        if (deepEqual(i, e)) return t;
        throw new L(B.FAILED_PRECONDITION, "initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.");
    }
    if (void 0 !== e.cacheSizeBytes && void 0 !== e.localCache) throw new L(B.INVALID_ARGUMENT, "cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");
    if (void 0 !== e.cacheSizeBytes && -1 !== e.cacheSizeBytes && e.cacheSizeBytes < 1048576) throw new L(B.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
    return s.initialize({
        options: e,
        instanceIdentifier: n
    });
}

function wh(e, n) {
    const s = "object" == typeof e ? e : getApp(), i = "string" == typeof e ? e : n || "(default)", r = _getProvider(s, "firestore").getImmediate({
        identifier: i
    });
    if (!r._initialized) {
        const t = getDefaultEmulatorHostnameAndPort("firestore");
        t && Xa(r, ...t);
    }
    return r;
}

/**
 * @internal
 */ function _h(t) {
    return t._firestoreClient || mh(t), t._firestoreClient.verifyNotTerminated(), t._firestoreClient;
}

function mh(t) {
    var e, n, s;
    const i = t._freezeSettings(), r = function(t, e, n, s) {
        return new ke(t, e, n, s.host, s.ssl, s.experimentalForceLongPolling, s.experimentalAutoDetectLongPolling, s.useFetchStreams);
    }(t._databaseId, (null === (e = t._app) || void 0 === e ? void 0 : e.options.appId) || "", t._persistenceKey, i);
    t._firestoreClient = new Ta(t._authCredentials, t._appCheckCredentials, t._queue, r), 
    (null === (n = i.cache) || void 0 === n ? void 0 : n._offlineComponentProvider) && (null === (s = i.cache) || void 0 === s ? void 0 : s._onlineComponentProvider) && (t._firestoreClient._uninitializedComponentsProvider = {
        _offlineKind: i.cache.kind,
        _offline: i.cache._offlineComponentProvider,
        _online: i.cache._onlineComponentProvider
    });
}

/**
 * Attempts to enable persistent storage, if possible.
 *
 * Must be called before any other functions (other than
 * {@link initializeFirestore}, {@link (getFirestore:1)} or
 * {@link clearIndexedDbPersistence}.
 *
 * If this fails, `enableIndexedDbPersistence()` will reject the promise it
 * returns. Note that even after this failure, the {@link Firestore} instance will
 * remain usable, however offline persistence will be disabled.
 *
 * There are several reasons why this can fail, which can be identified by
 * the `code` on the error.
 *
 *   * failed-precondition: The app is already open in another browser tab.
 *   * unimplemented: The browser is incompatible with the offline
 *     persistence implementation.
 *
 * @param firestore - The {@link Firestore} instance to enable persistence for.
 * @param persistenceSettings - Optional settings object to configure
 * persistence.
 * @returns A `Promise` that represents successfully enabling persistent storage.
 * @deprecated This function will be removed in a future major release. Instead, set
 * `FirestoreSettings.cache` to an instance of `IndexedDbLocalCache` to
 * turn on IndexedDb cache. Calling this function when `FirestoreSettings.cache`
 * is already specified will throw an exception.
 */ function gh(t, e) {
    Ph(t = Ha(t, fh));
    const n = _h(t);
    if (n._uninitializedComponentsProvider) throw new L(B.FAILED_PRECONDITION, "SDK cache is already specified.");
    N("enableIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");
    const s = t._freezeSettings(), i = new _a;
    return ph(n, i, new da(i, s.cacheSizeBytes, null == e ? void 0 : e.forceOwnership));
}

/**
 * Attempts to enable multi-tab persistent storage, if possible. If enabled
 * across all tabs, all operations share access to local persistence, including
 * shared execution of queries and latency-compensated local document updates
 * across all connected instances.
 *
 * If this fails, `enableMultiTabIndexedDbPersistence()` will reject the promise
 * it returns. Note that even after this failure, the {@link Firestore} instance will
 * remain usable, however offline persistence will be disabled.
 *
 * There are several reasons why this can fail, which can be identified by
 * the `code` on the error.
 *
 *   * failed-precondition: The app is already open in another browser tab and
 *     multi-tab is not enabled.
 *   * unimplemented: The browser is incompatible with the offline
 *     persistence implementation.
 *
 * @param firestore - The {@link Firestore} instance to enable persistence for.
 * @returns A `Promise` that represents successfully enabling persistent
 * storage.
 * @deprecated This function will be removed in a future major release. Instead, set
 * `FirestoreSettings.cache` to an instance of `IndexedDbLocalCache` to
 * turn on indexeddb cache. Calling this function when `FirestoreSettings.cache`
 * is already specified will throw an exception.
 */ function yh(t) {
    Ph(t = Ha(t, fh));
    const e = _h(t);
    if (e._uninitializedComponentsProvider) throw new L(B.FAILED_PRECONDITION, "SDK cache is already specified.");
    N("enableMultiTabIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");
    const n = t._freezeSettings(), s = new _a;
    return ph(e, s, new wa(s, n.cacheSizeBytes));
}

/**
 * Registers both the `OfflineComponentProvider` and `OnlineComponentProvider`.
 * If the operation fails with a recoverable error (see
 * `canRecoverFromIndexedDbError()` below), the returned Promise is rejected
 * but the client remains usable.
 */ function ph(t, e, n) {
    const s = new q;
    return t.asyncQueue.enqueue((async () => {
        try {
            await Ea(t, n), await Aa(t, e), s.resolve();
        } catch (t) {
            const e = t;
            if (!Ra(e)) throw e;
            N("Error enabling indexeddb cache. Falling back to memory cache: " + e), s.reject(e);
        }
    })).then((() => s.promise));
}

/**
 * Clears the persistent storage. This includes pending writes and cached
 * documents.
 *
 * Must be called while the {@link Firestore} instance is not started (after the app is
 * terminated or when the app is first initialized). On startup, this function
 * must be called before other functions (other than {@link
 * initializeFirestore} or {@link (getFirestore:1)})). If the {@link Firestore}
 * instance is still running, the promise will be rejected with the error code
 * of `failed-precondition`.
 *
 * Note: `clearIndexedDbPersistence()` is primarily intended to help write
 * reliable tests that use Cloud Firestore. It uses an efficient mechanism for
 * dropping existing data but does not attempt to securely overwrite or
 * otherwise make cached data unrecoverable. For applications that are sensitive
 * to the disclosure of cached data in between user sessions, we strongly
 * recommend not enabling persistence at all.
 *
 * @param firestore - The {@link Firestore} instance to clear persistence for.
 * @returns A `Promise` that is resolved when the persistent storage is
 * cleared. Otherwise, the promise is rejected with an error.
 */ function Ih(t) {
    if (t._initialized && !t._terminated) throw new L(B.FAILED_PRECONDITION, "Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.");
    const e = new q;
    return t._queue.enqueueAndForgetEvenWhileRestricted((async () => {
        try {
            await async function(t) {
                if (!vt.D()) return Promise.resolve();
                const e = t + "main";
                await vt.delete(e);
            }(Ko(t._databaseId, t._persistenceKey)), e.resolve();
        } catch (t) {
            e.reject(t);
        }
    })), e.promise;
}

/**
 * Waits until all currently pending writes for the active user have been
 * acknowledged by the backend.
 *
 * The returned promise resolves immediately if there are no outstanding writes.
 * Otherwise, the promise waits for all previously issued writes (including
 * those written in a previous app session), but it does not wait for writes
 * that were added after the function is called. If you want to wait for
 * additional writes, call `waitForPendingWrites()` again.
 *
 * Any outstanding `waitForPendingWrites()` promises are rejected during user
 * changes.
 *
 * @returns A `Promise` which resolves when all currently pending writes have been
 * acknowledged by the backend.
 */ function Th(t) {
    return function(t) {
        const e = new q;
        return t.asyncQueue.enqueueAndForget((async () => Kc(await Da(t), e))), e.promise;
    }(_h(t = Ha(t, fh)));
}

/**
 * Re-enables use of the network for this {@link Firestore} instance after a prior
 * call to {@link disableNetwork}.
 *
 * @returns A `Promise` that is resolved once the network has been enabled.
 */ function Eh(t) {
    return Na(_h(t = Ha(t, fh)));
}

/**
 * Disables network usage for this instance. It can be re-enabled via {@link
 * enableNetwork}. While the network is disabled, any snapshot listeners,
 * `getDoc()` or `getDocs()` calls will return results from cache, and any write
 * operations will be queued until the network is restored.
 *
 * @returns A `Promise` that is resolved once the network has been disabled.
 */ function Ah(t) {
    return ka(_h(t = Ha(t, fh)));
}

/**
 * Terminates the provided {@link Firestore} instance.
 *
 * After calling `terminate()` only the `clearIndexedDbPersistence()` function
 * may be used. Any other function will throw a `FirestoreError`.
 *
 * To restart after termination, create a new instance of FirebaseFirestore with
 * {@link (getFirestore:1)}.
 *
 * Termination does not cancel any pending writes, and any promises that are
 * awaiting a response from the server will not be resolved. If you have
 * persistence enabled, the next time you start this instance, it will resume
 * sending these writes to the server.
 *
 * Note: Under normal circumstances, calling `terminate()` is not required. This
 * function is useful only when you want to force this instance to release all
 * of its resources or in combination with `clearIndexedDbPersistence()` to
 * ensure that all local state is destroyed between test runs.
 *
 * @returns A `Promise` that is resolved when the instance has been successfully
 * terminated.
 */ function Rh(t) {
    return _removeServiceInstance(t.app, "firestore", t._databaseId.database), t._delete();
}

/**
 * Loads a Firestore bundle into the local cache.
 *
 * @param firestore - The {@link Firestore} instance to load bundles for.
 * @param bundleData - An object representing the bundle to be loaded. Valid
 * objects are `ArrayBuffer`, `ReadableStream<Uint8Array>` or `string`.
 *
 * @returns A `LoadBundleTask` object, which notifies callers with progress
 * updates, and completion or error events. It can be used as a
 * `Promise<LoadBundleTaskProgress>`.
 */ function vh(t, e) {
    const n = _h(t = Ha(t, fh)), s = new hh;
    return La(n, t._databaseId, e, s), s;
}

/**
 * Reads a Firestore {@link Query} from local cache, identified by the given
 * name.
 *
 * The named queries are packaged  into bundles on the server side (along
 * with resulting documents), and loaded to local cache using `loadBundle`. Once
 * in local cache, use this method to extract a {@link Query} by name.
 *
 * @param firestore - The {@link Firestore} instance to read the query from.
 * @param name - The name of the query.
 * @returns A `Promise` that is resolved with the Query or `null`.
 */ function bh(t, e) {
    return qa(_h(t = Ha(t, fh)), e).then((e => e ? new eh(t, null, e.query) : null));
}

function Ph(t) {
    if (t._initialized || t._terminated) throw new L(B.FAILED_PRECONDITION, "Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Represents an aggregation that can be performed by Firestore.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Vh {
    /**
     * Create a new AggregateField<T>
     * @param _aggregateType Specifies the type of aggregation operation to perform.
     * @param _internalFieldPath Optionally specifies the field that is aggregated.
     * @internal
     */
    constructor(
    // TODO (sum/avg) make aggregateType public when the feature is supported
    t = "count", e) {
        this._aggregateType = t, this._internalFieldPath = e, 
        /** A type string to uniquely identify instances of this class. */
        this.type = "AggregateField";
    }
}

/**
 * The results of executing an aggregation query.
 */ class Sh {
    /** @hideconstructor */
    constructor(t, e, n) {
        this._userDataWriter = e, this._data = n, 
        /** A type string to uniquely identify instances of this class. */
        this.type = "AggregateQuerySnapshot", this.query = t;
    }
    /**
     * Returns the results of the aggregations performed over the underlying
     * query.
     *
     * The keys of the returned object will be the same as those of the
     * `AggregateSpec` object specified to the aggregation method, and the values
     * will be the corresponding aggregation result.
     *
     * @returns The results of the aggregations performed over the underlying
     * query.
     */    data() {
        return this._userDataWriter.convertValue(this._data.value);
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * An immutable object representing an array of bytes.
 */ class Dh {
    /** @hideconstructor */
    constructor(t) {
        this._byteString = t;
    }
    /**
     * Creates a new `Bytes` object from the given Base64 string, converting it to
     * bytes.
     *
     * @param base64 - The Base64 string used to create the `Bytes` object.
     */    static fromBase64String(t) {
        try {
            return new Dh(be.fromBase64String(t));
        } catch (t) {
            throw new L(B.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + t);
        }
    }
    /**
     * Creates a new `Bytes` object from the given Uint8Array.
     *
     * @param array - The Uint8Array used to create the `Bytes` object.
     */    static fromUint8Array(t) {
        return new Dh(be.fromUint8Array(t));
    }
    /**
     * Returns the underlying bytes as a Base64-encoded string.
     *
     * @returns The Base64-encoded string created from the `Bytes` object.
     */    toBase64() {
        return this._byteString.toBase64();
    }
    /**
     * Returns the underlying bytes in a new `Uint8Array`.
     *
     * @returns The Uint8Array created from the `Bytes` object.
     */    toUint8Array() {
        return this._byteString.toUint8Array();
    }
    /**
     * Returns a string representation of the `Bytes` object.
     *
     * @returns A string representation of the `Bytes` object.
     */    toString() {
        return "Bytes(base64: " + this.toBase64() + ")";
    }
    /**
     * Returns true if this `Bytes` object is equal to the provided one.
     *
     * @param other - The `Bytes` object to compare against.
     * @returns true if this `Bytes` object is equal to the provided one.
     */    isEqual(t) {
        return this._byteString.isEqual(t._byteString);
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A `FieldPath` refers to a field in a document. The path may consist of a
 * single field name (referring to a top-level field in the document), or a
 * list of field names (referring to a nested field in the document).
 *
 * Create a `FieldPath` by providing field names. If more than one field
 * name is provided, the path will point to a nested field in a document.
 */ class Ch {
    /**
     * Creates a `FieldPath` from the provided field names. If more than one field
     * name is provided, the path will point to a nested field in a document.
     *
     * @param fieldNames - A list of field names.
     */
    constructor(...t) {
        for (let e = 0; e < t.length; ++e) if (0 === t[e].length) throw new L(B.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
        this._internalPath = new ut(t);
    }
    /**
     * Returns true if this `FieldPath` is equal to the provided one.
     *
     * @param other - The `FieldPath` to compare against.
     * @returns true if this `FieldPath` is equal to the provided one.
     */    isEqual(t) {
        return this._internalPath.isEqual(t._internalPath);
    }
}

/**
 * Returns a special sentinel `FieldPath` to refer to the ID of a document.
 * It can be used in queries to sort or filter by the document ID.
 */ function xh() {
    return new Ch("__name__");
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Sentinel values that can be used when writing document fields with `set()`
 * or `update()`.
 */ class Nh {
    /**
     * @param _methodName - The public API endpoint that returns this class.
     * @hideconstructor
     */
    constructor(t) {
        this._methodName = t;
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * An immutable object representing a geographic location in Firestore. The
 * location is represented as latitude/longitude pair.
 *
 * Latitude values are in the range of [-90, 90].
 * Longitude values are in the range of [-180, 180].
 */ class kh {
    /**
     * Creates a new immutable `GeoPoint` object with the provided latitude and
     * longitude values.
     * @param latitude - The latitude as number between -90 and 90.
     * @param longitude - The longitude as number between -180 and 180.
     */
    constructor(t, e) {
        if (!isFinite(t) || t < -90 || t > 90) throw new L(B.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + t);
        if (!isFinite(e) || e < -180 || e > 180) throw new L(B.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + e);
        this._lat = t, this._long = e;
    }
    /**
     * The latitude of this `GeoPoint` instance.
     */    get latitude() {
        return this._lat;
    }
    /**
     * The longitude of this `GeoPoint` instance.
     */    get longitude() {
        return this._long;
    }
    /**
     * Returns true if this `GeoPoint` is equal to the provided one.
     *
     * @param other - The `GeoPoint` to compare against.
     * @returns true if this `GeoPoint` is equal to the provided one.
     */    isEqual(t) {
        return this._lat === t._lat && this._long === t._long;
    }
    /** Returns a JSON-serializable representation of this GeoPoint. */    toJSON() {
        return {
            latitude: this._lat,
            longitude: this._long
        };
    }
    /**
     * Actually private to JS consumers of our API, so this function is prefixed
     * with an underscore.
     */    _compareTo(t) {
        return X(this._lat, t._lat) || X(this._long, t._long);
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Oh = /^__.*__$/;

/** The result of parsing document data (e.g. for a setData call). */ class $h {
    constructor(t, e, n) {
        this.data = t, this.fieldMask = e, this.fieldTransforms = n;
    }
    toMutation(t, e) {
        return null !== this.fieldMask ? new Gs(t, this.data, this.fieldMask, e, this.fieldTransforms) : new Ks(t, this.data, e, this.fieldTransforms);
    }
}

/** The result of parsing "update" data (i.e. for an updateData call). */ class Mh {
    constructor(t, 
    // The fieldMask does not include document transforms.
    e, n) {
        this.data = t, this.fieldMask = e, this.fieldTransforms = n;
    }
    toMutation(t, e) {
        return new Gs(t, this.data, this.fieldMask, e, this.fieldTransforms);
    }
}

function Fh(t) {
    switch (t) {
      case 0 /* UserDataSource.Set */ :
 // fall through
              case 2 /* UserDataSource.MergeSet */ :
 // fall through
              case 1 /* UserDataSource.Update */ :
        return !0;

      case 3 /* UserDataSource.Argument */ :
      case 4 /* UserDataSource.ArrayArgument */ :
        return !1;

      default:
        throw O();
    }
}

/** A "context" object passed around while parsing user data. */ class Bh {
    /**
     * Initializes a ParseContext with the given source and path.
     *
     * @param settings - The settings for the parser.
     * @param databaseId - The database ID of the Firestore instance.
     * @param serializer - The serializer to use to generate the Value proto.
     * @param ignoreUndefinedProperties - Whether to ignore undefined properties
     * rather than throw.
     * @param fieldTransforms - A mutable list of field transforms encountered
     * while parsing the data.
     * @param fieldMask - A mutable list of field paths encountered while parsing
     * the data.
     *
     * TODO(b/34871131): We don't support array paths right now, so path can be
     * null to indicate the context represents any location within an array (in
     * which case certain features will not work and errors will be somewhat
     * compromised).
     */
    constructor(t, e, n, s, i, r) {
        this.settings = t, this.databaseId = e, this.serializer = n, this.ignoreUndefinedProperties = s, 
        // Minor hack: If fieldTransforms is undefined, we assume this is an
        // external call and we need to validate the entire path.
        void 0 === i && this.Jc(), this.fieldTransforms = i || [], this.fieldMask = r || [];
    }
    get path() {
        return this.settings.path;
    }
    get Yc() {
        return this.settings.Yc;
    }
    /** Returns a new context with the specified settings overwritten. */    Zc(t) {
        return new Bh(Object.assign(Object.assign({}, this.settings), t), this.databaseId, this.serializer, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
    }
    Xc(t) {
        var e;
        const n = null === (e = this.path) || void 0 === e ? void 0 : e.child(t), s = this.Zc({
            path: n,
            ta: !1
        });
        return s.ea(t), s;
    }
    na(t) {
        var e;
        const n = null === (e = this.path) || void 0 === e ? void 0 : e.child(t), s = this.Zc({
            path: n,
            ta: !1
        });
        return s.Jc(), s;
    }
    sa(t) {
        // TODO(b/34871131): We don't support array paths right now; so make path
        // undefined.
        return this.Zc({
            path: void 0,
            ta: !0
        });
    }
    ia(t) {
        return rl(t, this.settings.methodName, this.settings.ra || !1, this.path, this.settings.oa);
    }
    /** Returns 'true' if 'fieldPath' was traversed when creating this context. */    contains(t) {
        return void 0 !== this.fieldMask.find((e => t.isPrefixOf(e))) || void 0 !== this.fieldTransforms.find((e => t.isPrefixOf(e.field)));
    }
    Jc() {
        // TODO(b/34871131): Remove null check once we have proper paths for fields
        // within arrays.
        if (this.path) for (let t = 0; t < this.path.length; t++) this.ea(this.path.get(t));
    }
    ea(t) {
        if (0 === t.length) throw this.ia("Document fields must not be empty");
        if (Fh(this.Yc) && Oh.test(t)) throw this.ia('Document fields cannot begin and end with "__"');
    }
}

/**
 * Helper for parsing raw user input (provided via the API) into internal model
 * classes.
 */ class Lh {
    constructor(t, e, n) {
        this.databaseId = t, this.ignoreUndefinedProperties = e, this.serializer = n || Vu(t);
    }
    /** Creates a new top-level parse context. */    ua(t, e, n, s = !1) {
        return new Bh({
            Yc: t,
            methodName: e,
            oa: n,
            path: ut.emptyPath(),
            ta: !1,
            ra: s
        }, this.databaseId, this.serializer, this.ignoreUndefinedProperties);
    }
}

function qh(t) {
    const e = t._freezeSettings(), n = Vu(t._databaseId);
    return new Lh(t._databaseId, !!e.ignoreUndefinedProperties, n);
}

/** Parse document data from a set() call. */ function Uh(t, e, n, s, i, r = {}) {
    const o = t.ua(r.merge || r.mergeFields ? 2 /* UserDataSource.MergeSet */ : 0 /* UserDataSource.Set */ , e, n, i);
    el("Data must be an object, but it was:", o, s);
    const u = Xh(s, o);
    let c, a;
    if (r.merge) c = new Ae(o.fieldMask), a = o.fieldTransforms; else if (r.mergeFields) {
        const t = [];
        for (const s of r.mergeFields) {
            const i = nl(e, s, n);
            if (!o.contains(i)) throw new L(B.INVALID_ARGUMENT, `Field '${i}' is specified in your field mask but missing from your input data.`);
            ol(t, i) || t.push(i);
        }
        c = new Ae(t), a = o.fieldTransforms.filter((t => c.covers(t.field)));
    } else c = null, a = o.fieldTransforms;
    return new $h(new sn(u), c, a);
}

class Kh extends Nh {
    _toFieldTransform(t) {
        if (2 /* UserDataSource.MergeSet */ !== t.Yc) throw 1 /* UserDataSource.Update */ === t.Yc ? t.ia(`${this._methodName}() can only appear at the top level of your update data`) : t.ia(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);
        // No transform to add for a delete, but we need to add it to our
        // fieldMask so it gets deleted.
        return t.fieldMask.push(t.path), null;
    }
    isEqual(t) {
        return t instanceof Kh;
    }
}

/**
 * Creates a child context for parsing SerializableFieldValues.
 *
 * This is different than calling `ParseContext.contextWith` because it keeps
 * the fieldTransforms and fieldMask separate.
 *
 * The created context has its `dataSource` set to `UserDataSource.Argument`.
 * Although these values are used with writes, any elements in these FieldValues
 * are not considered writes since they cannot contain any FieldValue sentinels,
 * etc.
 *
 * @param fieldValue - The sentinel FieldValue for which to create a child
 *     context.
 * @param context - The parent context.
 * @param arrayElement - Whether or not the FieldValue has an array.
 */ function Gh(t, e, n) {
    return new Bh({
        Yc: 3 /* UserDataSource.Argument */ ,
        oa: e.settings.oa,
        methodName: t._methodName,
        ta: n
    }, e.databaseId, e.serializer, e.ignoreUndefinedProperties);
}

class Qh extends Nh {
    _toFieldTransform(t) {
        return new xs(t.path, new Rs);
    }
    isEqual(t) {
        return t instanceof Qh;
    }
}

class zh extends Nh {
    constructor(t, e) {
        super(t), this.ca = e;
    }
    _toFieldTransform(t) {
        const e = Gh(this, t, 
        /*array=*/ !0), n = this.ca.map((t => Zh(t, e))), s = new vs(n);
        return new xs(t.path, s);
    }
    isEqual(t) {
        // TODO(mrschmidt): Implement isEquals
        return this === t;
    }
}

class jh extends Nh {
    constructor(t, e) {
        super(t), this.ca = e;
    }
    _toFieldTransform(t) {
        const e = Gh(this, t, 
        /*array=*/ !0), n = this.ca.map((t => Zh(t, e))), s = new Ps(n);
        return new xs(t.path, s);
    }
    isEqual(t) {
        // TODO(mrschmidt): Implement isEquals
        return this === t;
    }
}

class Wh extends Nh {
    constructor(t, e) {
        super(t), this.aa = e;
    }
    _toFieldTransform(t) {
        const e = new Ss(t.serializer, ps(t.serializer, this.aa));
        return new xs(t.path, e);
    }
    isEqual(t) {
        // TODO(mrschmidt): Implement isEquals
        return this === t;
    }
}

/** Parse update data from an update() call. */ function Hh(t, e, n, s) {
    const i = t.ua(1 /* UserDataSource.Update */ , e, n);
    el("Data must be an object, but it was:", i, s);
    const r = [], o = sn.empty();
    _e(s, ((t, s) => {
        const u = il(e, t, n);
        // For Compat types, we have to "extract" the underlying types before
        // performing validation.
                s = getModularInstance(s);
        const c = i.na(u);
        if (s instanceof Kh) 
        // Add it to the field mask, but don't add anything to updateData.
        r.push(u); else {
            const t = Zh(s, c);
            null != t && (r.push(u), o.set(u, t));
        }
    }));
    const u = new Ae(r);
    return new Mh(o, u, i.fieldTransforms);
}

/** Parse update data from a list of field/value arguments. */ function Jh(t, e, n, s, i, r) {
    const o = t.ua(1 /* UserDataSource.Update */ , e, n), u = [ nl(e, s, n) ], c = [ i ];
    if (r.length % 2 != 0) throw new L(B.INVALID_ARGUMENT, `Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);
    for (let t = 0; t < r.length; t += 2) u.push(nl(e, r[t])), c.push(r[t + 1]);
    const a = [], h = sn.empty();
    // We iterate in reverse order to pick the last value for a field if the
    // user specified the field multiple times.
    for (let t = u.length - 1; t >= 0; --t) if (!ol(a, u[t])) {
        const e = u[t];
        let n = c[t];
        // For Compat types, we have to "extract" the underlying types before
        // performing validation.
                n = getModularInstance(n);
        const s = o.na(e);
        if (n instanceof Kh) 
        // Add it to the field mask, but don't add anything to updateData.
        a.push(e); else {
            const t = Zh(n, s);
            null != t && (a.push(e), h.set(e, t));
        }
    }
    const l = new Ae(a);
    return new Mh(h, l, o.fieldTransforms);
}

/**
 * Parse a "query value" (e.g. value in a where filter or a value in a cursor
 * bound).
 *
 * @param allowArrays - Whether the query value is an array that may directly
 * contain additional arrays (e.g. the operand of an `in` query).
 */ function Yh(t, e, n, s = !1) {
    return Zh(n, t.ua(s ? 4 /* UserDataSource.ArrayArgument */ : 3 /* UserDataSource.Argument */ , e));
}

/**
 * Parses user data to Protobuf Values.
 *
 * @param input - Data to be parsed.
 * @param context - A context object representing the current path being parsed,
 * the source of the data being parsed, etc.
 * @returns The parsed value, or null if the value was a FieldValue sentinel
 * that should not be included in the resulting parsed data.
 */ function Zh(t, e) {
    if (tl(
    // Unwrap the API type from the Compat SDK. This will return the API type
    // from firestore-exp.
    t = getModularInstance(t))) return el("Unsupported field value:", e, t), Xh(t, e);
    if (t instanceof Nh) 
    // FieldValues usually parse into transforms (except deleteField())
    // in which case we do not want to include this field in our parsed data
    // (as doing so will overwrite the field directly prior to the transform
    // trying to transform it). So we don't add this location to
    // context.fieldMask and we return null as our parsing result.
    /**
 * "Parses" the provided FieldValueImpl, adding any necessary transforms to
 * context.fieldTransforms.
 */
    return function(t, e) {
        // Sentinels are only supported with writes, and not within arrays.
        if (!Fh(e.Yc)) throw e.ia(`${t._methodName}() can only be used with update() and set()`);
        if (!e.path) throw e.ia(`${t._methodName}() is not currently supported inside arrays`);
        const n = t._toFieldTransform(e);
        n && e.fieldTransforms.push(n);
    }
    /**
 * Helper to parse a scalar value (i.e. not an Object, Array, or FieldValue)
 *
 * @returns The parsed value
 */ (t, e), null;
    if (void 0 === t && e.ignoreUndefinedProperties) 
    // If the input is undefined it can never participate in the fieldMask, so
    // don't handle this below. If `ignoreUndefinedProperties` is false,
    // `parseScalarValue` will reject an undefined value.
    return null;
    if (
    // If context.path is null we are inside an array and we don't support
    // field mask paths more granular than the top-level array.
    e.path && e.fieldMask.push(e.path), t instanceof Array) {
        // TODO(b/34871131): Include the path containing the array in the error
        // message.
        // In the case of IN queries, the parsed data is an array (representing
        // the set of values to be included for the IN query) that may directly
        // contain additional arrays (each representing an individual field
        // value), so we disable this validation.
        if (e.settings.ta && 4 /* UserDataSource.ArrayArgument */ !== e.Yc) throw e.ia("Nested arrays are not supported");
        return function(t, e) {
            const n = [];
            let s = 0;
            for (const i of t) {
                let t = Zh(i, e.sa(s));
                null == t && (
                // Just include nulls in the array for fields being replaced with a
                // sentinel.
                t = {
                    nullValue: "NULL_VALUE"
                }), n.push(t), s++;
            }
            return {
                arrayValue: {
                    values: n
                }
            };
        }(t, e);
    }
    return function(t, e) {
        if (null === (t = getModularInstance(t))) return {
            nullValue: "NULL_VALUE"
        };
        if ("number" == typeof t) return ps(e.serializer, t);
        if ("boolean" == typeof t) return {
            booleanValue: t
        };
        if ("string" == typeof t) return {
            stringValue: t
        };
        if (t instanceof Date) {
            const n = nt.fromDate(t);
            return {
                timestampValue: Ei(e.serializer, n)
            };
        }
        if (t instanceof nt) {
            // Firestore backend truncates precision down to microseconds. To ensure
            // offline mode works the same with regards to truncation, perform the
            // truncation immediately without waiting for the backend to do that.
            const n = new nt(t.seconds, 1e3 * Math.floor(t.nanoseconds / 1e3));
            return {
                timestampValue: Ei(e.serializer, n)
            };
        }
        if (t instanceof kh) return {
            geoPointValue: {
                latitude: t.latitude,
                longitude: t.longitude
            }
        };
        if (t instanceof Dh) return {
            bytesValue: Ai(e.serializer, t._byteString)
        };
        if (t instanceof th) {
            const n = e.databaseId, s = t.firestore._databaseId;
            if (!s.isEqual(n)) throw e.ia(`Document reference is for database ${s.projectId}/${s.database} but should be for database ${n.projectId}/${n.database}`);
            return {
                referenceValue: bi(t.firestore._databaseId || e.databaseId, t._key.path)
            };
        }
        throw e.ia(`Unsupported field value: ${Wa(t)}`);
    }
    /**
 * Checks whether an object looks like a JSON object that should be converted
 * into a struct. Normal class/prototype instances are considered to look like
 * JSON objects since they should be converted to a struct value. Arrays, Dates,
 * GeoPoints, etc. are not considered to look like JSON objects since they map
 * to specific FieldValue types other than ObjectValue.
 */ (t, e);
}

function Xh(t, e) {
    const n = {};
    return me(t) ? 
    // If we encounter an empty object, we explicitly add it to the update
    // mask to ensure that the server creates a map entry.
    e.path && e.path.length > 0 && e.fieldMask.push(e.path) : _e(t, ((t, s) => {
        const i = Zh(s, e.Xc(t));
        null != i && (n[t] = i);
    })), {
        mapValue: {
            fields: n
        }
    };
}

function tl(t) {
    return !("object" != typeof t || null === t || t instanceof Array || t instanceof Date || t instanceof nt || t instanceof kh || t instanceof Dh || t instanceof th || t instanceof Nh);
}

function el(t, e, n) {
    if (!tl(n) || !function(t) {
        return "object" == typeof t && null !== t && (Object.getPrototypeOf(t) === Object.prototype || null === Object.getPrototypeOf(t));
    }(n)) {
        const s = Wa(n);
        throw "an object" === s ? e.ia(t + " a custom object") : e.ia(t + " " + s);
    }
}

/**
 * Helper that calls fromDotSeparatedString() but wraps any error thrown.
 */ function nl(t, e, n) {
    if ((
    // If required, replace the FieldPath Compat class with with the firestore-exp
    // FieldPath.
    e = getModularInstance(e)) instanceof Ch) return e._internalPath;
    if ("string" == typeof e) return il(t, e);
    throw rl("Field path arguments must be of type string or ", t, 
    /* hasConverter= */ !1, 
    /* path= */ void 0, n);
}

/**
 * Matches any characters in a field path string that are reserved.
 */ const sl = new RegExp("[~\\*/\\[\\]]");

/**
 * Wraps fromDotSeparatedString with an error message about the method that
 * was thrown.
 * @param methodName - The publicly visible method name
 * @param path - The dot-separated string form of a field path which will be
 * split on dots.
 * @param targetDoc - The document against which the field path will be
 * evaluated.
 */ function il(t, e, n) {
    if (e.search(sl) >= 0) throw rl(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`, t, 
    /* hasConverter= */ !1, 
    /* path= */ void 0, n);
    try {
        return new Ch(...e.split("."))._internalPath;
    } catch (s) {
        throw rl(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`, t, 
        /* hasConverter= */ !1, 
        /* path= */ void 0, n);
    }
}

function rl(t, e, n, s, i) {
    const r = s && !s.isEmpty(), o = void 0 !== i;
    let u = `Function ${e}() called with invalid data`;
    n && (u += " (via `toFirestore()`)"), u += ". ";
    let c = "";
    return (r || o) && (c += " (found", r && (c += ` in field ${s}`), o && (c += ` in document ${i}`), 
    c += ")"), new L(B.INVALID_ARGUMENT, u + t + c);
}

/** Checks `haystack` if FieldPath `needle` is present. Runs in O(n). */ function ol(t, e) {
    return t.some((t => t.isEqual(e)));
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A `DocumentSnapshot` contains data read from a document in your Firestore
 * database. The data can be extracted with `.data()` or `.get(<field>)` to
 * get a specific field.
 *
 * For a `DocumentSnapshot` that points to a non-existing document, any data
 * access will return 'undefined'. You can use the `exists()` method to
 * explicitly verify a document's existence.
 */ class ul {
    // Note: This class is stripped down version of the DocumentSnapshot in
    // the legacy SDK. The changes are:
    // - No support for SnapshotMetadata.
    // - No support for SnapshotOptions.
    /** @hideconstructor protected */
    constructor(t, e, n, s, i) {
        this._firestore = t, this._userDataWriter = e, this._key = n, this._document = s, 
        this._converter = i;
    }
    /** Property of the `DocumentSnapshot` that provides the document's ID. */    get id() {
        return this._key.path.lastSegment();
    }
    /**
     * The `DocumentReference` for the document included in the `DocumentSnapshot`.
     */    get ref() {
        return new th(this._firestore, this._converter, this._key);
    }
    /**
     * Signals whether or not the document at the snapshot's location exists.
     *
     * @returns true if the document exists.
     */    exists() {
        return null !== this._document;
    }
    /**
     * Retrieves all fields in the document as an `Object`. Returns `undefined` if
     * the document doesn't exist.
     *
     * @returns An `Object` containing all fields in the document or `undefined`
     * if the document doesn't exist.
     */    data() {
        if (this._document) {
            if (this._converter) {
                // We only want to use the converter and create a new DocumentSnapshot
                // if a converter has been provided.
                const t = new cl(this._firestore, this._userDataWriter, this._key, this._document, 
                /* converter= */ null);
                return this._converter.fromFirestore(t);
            }
            return this._userDataWriter.convertValue(this._document.data.value);
        }
    }
    /**
     * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
     * document or field doesn't exist.
     *
     * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
     * field.
     * @returns The data at the specified field location or undefined if no such
     * field exists in the document.
     */
    // We are using `any` here to avoid an explicit cast by our users.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(t) {
        if (this._document) {
            const e = this._document.data.field(al("DocumentSnapshot.get", t));
            if (null !== e) return this._userDataWriter.convertValue(e);
        }
    }
}

/**
 * A `QueryDocumentSnapshot` contains data read from a document in your
 * Firestore database as part of a query. The document is guaranteed to exist
 * and its data can be extracted with `.data()` or `.get(<field>)` to get a
 * specific field.
 *
 * A `QueryDocumentSnapshot` offers the same API surface as a
 * `DocumentSnapshot`. Since query results contain only existing documents, the
 * `exists` property will always be true and `data()` will never return
 * 'undefined'.
 */ class cl extends ul {
    /**
     * Retrieves all fields in the document as an `Object`.
     *
     * @override
     * @returns An `Object` containing all fields in the document.
     */
    data() {
        return super.data();
    }
}

/**
 * Helper that calls `fromDotSeparatedString()` but wraps any error thrown.
 */ function al(t, e) {
    return "string" == typeof e ? il(t, e) : e instanceof Ch ? e._internalPath : e._delegate._internalPath;
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function hl(t) {
    if ("L" /* LimitType.Last */ === t.limitType && 0 === t.explicitOrderBy.length) throw new L(B.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
}

/**
 * An `AppliableConstraint` is an abstraction of a constraint that can be applied
 * to a Firestore query.
 */ class ll {}

/**
 * A `QueryConstraint` is used to narrow the set of documents returned by a
 * Firestore query. `QueryConstraint`s are created by invoking {@link where},
 * {@link orderBy}, {@link (startAt:1)}, {@link (startAfter:1)}, {@link
 * (endBefore:1)}, {@link (endAt:1)}, {@link limit}, {@link limitToLast} and
 * can then be passed to {@link (query:1)} to create a new query instance that
 * also contains this `QueryConstraint`.
 */ class fl extends ll {}

function dl(t, e, ...n) {
    let s = [];
    e instanceof ll && s.push(e), s = s.concat(n), function(t) {
        const e = t.filter((t => t instanceof ml)).length, n = t.filter((t => t instanceof wl)).length;
        if (e > 1 || e > 0 && n > 0) throw new L(B.INVALID_ARGUMENT, "InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.");
    }
    /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
    /**
 * Converts Firestore's internal types to the JavaScript types that we expose
 * to the user.
 *
 * @internal
 */ (s);
    for (const e of s) t = e._apply(t);
    return t;
}

/**
 * A `QueryFieldFilterConstraint` is used to narrow the set of documents returned by
 * a Firestore query by filtering on one or more document fields.
 * `QueryFieldFilterConstraint`s are created by invoking {@link where} and can then
 * be passed to {@link (query:1)} to create a new query instance that also contains
 * this `QueryFieldFilterConstraint`.
 */ class wl extends fl {
    /**
     * @internal
     */
    constructor(t, e, n) {
        super(), this._field = t, this._op = e, this._value = n, 
        /** The type of this query constraint */
        this.type = "where";
    }
    static _create(t, e, n) {
        return new wl(t, e, n);
    }
    _apply(t) {
        const e = this._parse(t);
        return Nl(t._query, e), new eh(t.firestore, t.converter, Wn(t._query, e));
    }
    _parse(t) {
        const e = qh(t.firestore), n = function(t, e, n, s, i, r, o) {
            let u;
            if (i.isKeyField()) {
                if ("array-contains" /* Operator.ARRAY_CONTAINS */ === r || "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ === r) throw new L(B.INVALID_ARGUMENT, `Invalid Query. You can't perform '${r}' queries on documentId().`);
                if ("in" /* Operator.IN */ === r || "not-in" /* Operator.NOT_IN */ === r) {
                    xl(o, r);
                    const e = [];
                    for (const n of o) e.push(Cl(s, t, n));
                    u = {
                        arrayValue: {
                            values: e
                        }
                    };
                } else u = Cl(s, t, o);
            } else "in" /* Operator.IN */ !== r && "not-in" /* Operator.NOT_IN */ !== r && "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ !== r || xl(o, r), 
            u = Yh(n, e, o, 
            /* allowArrays= */ "in" /* Operator.IN */ === r || "not-in" /* Operator.NOT_IN */ === r);
            return dn.create(i, r, u);
        }(t._query, "where", e, t.firestore._databaseId, this._field, this._op, this._value);
        return n;
    }
}

/**
 * Creates a {@link QueryFieldFilterConstraint} that enforces that documents
 * must contain the specified field and that the value should satisfy the
 * relation constraint provided.
 *
 * @param fieldPath - The path to compare
 * @param opStr - The operation string (e.g "&lt;", "&lt;=", "==", "&lt;",
 *   "&lt;=", "!=").
 * @param value - The value for comparison
 * @returns The created {@link QueryFieldFilterConstraint}.
 */ function _l(t, e, n) {
    const s = e, i = al("where", t);
    return wl._create(i, s, n);
}

/**
 * A `QueryCompositeFilterConstraint` is used to narrow the set of documents
 * returned by a Firestore query by performing the logical OR or AND of multiple
 * {@link QueryFieldFilterConstraint}s or {@link QueryCompositeFilterConstraint}s.
 * `QueryCompositeFilterConstraint`s are created by invoking {@link or} or
 * {@link and} and can then be passed to {@link (query:1)} to create a new query
 * instance that also contains the `QueryCompositeFilterConstraint`.
 */ class ml extends ll {
    /**
     * @internal
     */
    constructor(
    /** The type of this query constraint */
    t, e) {
        super(), this.type = t, this._queryConstraints = e;
    }
    static _create(t, e) {
        return new ml(t, e);
    }
    _parse(t) {
        const e = this._queryConstraints.map((e => e._parse(t))).filter((t => t.getFilters().length > 0));
        return 1 === e.length ? e[0] : wn.create(e, this._getOperator());
    }
    _apply(t) {
        const e = this._parse(t);
        return 0 === e.getFilters().length ? t : (function(t, e) {
            let n = t;
            const s = e.getFlattenedFilters();
            for (const t of s) Nl(n, t), n = Wn(n, t);
        }
        // Checks if any of the provided filter operators are included in the given list of filters and
        // returns the first one that is, or null if none are.
        (t._query, e), new eh(t.firestore, t.converter, Wn(t._query, e)));
    }
    _getQueryConstraints() {
        return this._queryConstraints;
    }
    _getOperator() {
        return "and" === this.type ? "and" /* CompositeOperator.AND */ : "or" /* CompositeOperator.OR */;
    }
}

/**
 * Creates a new {@link QueryCompositeFilterConstraint} that is a disjunction of
 * the given filter constraints. A disjunction filter includes a document if it
 * satisfies any of the given filters.
 *
 * @param queryConstraints - Optional. The list of
 * {@link QueryFilterConstraint}s to perform a disjunction for. These must be
 * created with calls to {@link where}, {@link or}, or {@link and}.
 * @returns The newly created {@link QueryCompositeFilterConstraint}.
 */ function gl(...t) {
    // Only support QueryFilterConstraints
    return t.forEach((t => Ol("or", t))), ml._create("or" /* CompositeOperator.OR */ , t);
}

/**
 * Creates a new {@link QueryCompositeFilterConstraint} that is a conjunction of
 * the given filter constraints. A conjunction filter includes a document if it
 * satisfies all of the given filters.
 *
 * @param queryConstraints - Optional. The list of
 * {@link QueryFilterConstraint}s to perform a conjunction for. These must be
 * created with calls to {@link where}, {@link or}, or {@link and}.
 * @returns The newly created {@link QueryCompositeFilterConstraint}.
 */ function yl(...t) {
    // Only support QueryFilterConstraints
    return t.forEach((t => Ol("and", t))), ml._create("and" /* CompositeOperator.AND */ , t);
}

/**
 * A `QueryOrderByConstraint` is used to sort the set of documents returned by a
 * Firestore query. `QueryOrderByConstraint`s are created by invoking
 * {@link orderBy} and can then be passed to {@link (query:1)} to create a new query
 * instance that also contains this `QueryOrderByConstraint`.
 *
 * Note: Documents that do not contain the orderBy field will not be present in
 * the query result.
 */ class pl extends fl {
    /**
     * @internal
     */
    constructor(t, e) {
        super(), this._field = t, this._direction = e, 
        /** The type of this query constraint */
        this.type = "orderBy";
    }
    static _create(t, e) {
        return new pl(t, e);
    }
    _apply(t) {
        const e = function(t, e, n) {
            if (null !== t.startAt) throw new L(B.INVALID_ARGUMENT, "Invalid query. You must not call startAt() or startAfter() before calling orderBy().");
            if (null !== t.endAt) throw new L(B.INVALID_ARGUMENT, "Invalid query. You must not call endAt() or endBefore() before calling orderBy().");
            const s = new hn(e, n);
            return function(t, e) {
                if (null === Kn(t)) {
                    // This is the first order by. It must match any inequality.
                    const n = Gn(t);
                    null !== n && kl(t, n, e.field);
                }
            }(t, s), s;
        }
        /**
 * Create a `Bound` from a query and a document.
 *
 * Note that the `Bound` will always include the key of the document
 * and so only the provided document will compare equal to the returned
 * position.
 *
 * Will throw if the document does not contain all fields of the order by
 * of the query or if any of the fields in the order by are an uncommitted
 * server timestamp.
 */ (t._query, this._field, this._direction);
        return new eh(t.firestore, t.converter, function(t, e) {
            // TODO(dimond): validate that orderBy does not list the same key twice.
            const n = t.explicitOrderBy.concat([ e ]);
            return new Bn(t.path, t.collectionGroup, n, t.filters.slice(), t.limit, t.limitType, t.startAt, t.endAt);
        }(t._query, e));
    }
}

/**
 * Creates a {@link QueryOrderByConstraint} that sorts the query result by the
 * specified field, optionally in descending order instead of ascending.
 *
 * Note: Documents that do not contain the specified field will not be present
 * in the query result.
 *
 * @param fieldPath - The field to sort by.
 * @param directionStr - Optional direction to sort by ('asc' or 'desc'). If
 * not specified, order will be ascending.
 * @returns The created {@link QueryOrderByConstraint}.
 */ function Il(t, e = "asc") {
    const n = e, s = al("orderBy", t);
    return pl._create(s, n);
}

/**
 * A `QueryLimitConstraint` is used to limit the number of documents returned by
 * a Firestore query.
 * `QueryLimitConstraint`s are created by invoking {@link limit} or
 * {@link limitToLast} and can then be passed to {@link (query:1)} to create a new
 * query instance that also contains this `QueryLimitConstraint`.
 */ class Tl extends fl {
    /**
     * @internal
     */
    constructor(
    /** The type of this query constraint */
    t, e, n) {
        super(), this.type = t, this._limit = e, this._limitType = n;
    }
    static _create(t, e, n) {
        return new Tl(t, e, n);
    }
    _apply(t) {
        return new eh(t.firestore, t.converter, Hn(t._query, this._limit, this._limitType));
    }
}

/**
 * Creates a {@link QueryLimitConstraint} that only returns the first matching
 * documents.
 *
 * @param limit - The maximum number of items to return.
 * @returns The created {@link QueryLimitConstraint}.
 */ function El(t) {
    return Ja("limit", t), Tl._create("limit", t, "F" /* LimitType.First */);
}

/**
 * Creates a {@link QueryLimitConstraint} that only returns the last matching
 * documents.
 *
 * You must specify at least one `orderBy` clause for `limitToLast` queries,
 * otherwise an exception will be thrown during execution.
 *
 * @param limit - The maximum number of items to return.
 * @returns The created {@link QueryLimitConstraint}.
 */ function Al(t) {
    return Ja("limitToLast", t), Tl._create("limitToLast", t, "L" /* LimitType.Last */);
}

/**
 * A `QueryStartAtConstraint` is used to exclude documents from the start of a
 * result set returned by a Firestore query.
 * `QueryStartAtConstraint`s are created by invoking {@link (startAt:1)} or
 * {@link (startAfter:1)} and can then be passed to {@link (query:1)} to create a
 * new query instance that also contains this `QueryStartAtConstraint`.
 */ class Rl extends fl {
    /**
     * @internal
     */
    constructor(
    /** The type of this query constraint */
    t, e, n) {
        super(), this.type = t, this._docOrFields = e, this._inclusive = n;
    }
    static _create(t, e, n) {
        return new Rl(t, e, n);
    }
    _apply(t) {
        const e = Dl(t, this.type, this._docOrFields, this._inclusive);
        return new eh(t.firestore, t.converter, function(t, e) {
            return new Bn(t.path, t.collectionGroup, t.explicitOrderBy.slice(), t.filters.slice(), t.limit, t.limitType, e, t.endAt);
        }(t._query, e));
    }
}

function vl(...t) {
    return Rl._create("startAt", t, 
    /*inclusive=*/ !0);
}

function bl(...t) {
    return Rl._create("startAfter", t, 
    /*inclusive=*/ !1);
}

/**
 * A `QueryEndAtConstraint` is used to exclude documents from the end of a
 * result set returned by a Firestore query.
 * `QueryEndAtConstraint`s are created by invoking {@link (endAt:1)} or
 * {@link (endBefore:1)} and can then be passed to {@link (query:1)} to create a new
 * query instance that also contains this `QueryEndAtConstraint`.
 */ class Pl extends fl {
    /**
     * @internal
     */
    constructor(
    /** The type of this query constraint */
    t, e, n) {
        super(), this.type = t, this._docOrFields = e, this._inclusive = n;
    }
    static _create(t, e, n) {
        return new Pl(t, e, n);
    }
    _apply(t) {
        const e = Dl(t, this.type, this._docOrFields, this._inclusive);
        return new eh(t.firestore, t.converter, function(t, e) {
            return new Bn(t.path, t.collectionGroup, t.explicitOrderBy.slice(), t.filters.slice(), t.limit, t.limitType, t.startAt, e);
        }(t._query, e));
    }
}

function Vl(...t) {
    return Pl._create("endBefore", t, 
    /*inclusive=*/ !1);
}

function Sl(...t) {
    return Pl._create("endAt", t, 
    /*inclusive=*/ !0);
}

/** Helper function to create a bound from a document or fields */ function Dl(t, e, n, s) {
    if (n[0] = getModularInstance(n[0]), n[0] instanceof ul) return function(t, e, n, s, i) {
        if (!s) throw new L(B.NOT_FOUND, `Can't use a DocumentSnapshot that doesn't exist for ${n}().`);
        const r = [];
        // Because people expect to continue/end a query at the exact document
        // provided, we need to use the implicit sort order rather than the explicit
        // sort order, because it's guaranteed to contain the document key. That way
        // the position becomes unambiguous and the query continues/ends exactly at
        // the provided document. Without the key (by using the explicit sort
        // orders), multiple documents could match the position, yielding duplicate
        // results.
                for (const n of zn(t)) if (n.field.isKeyField()) r.push(Qe(e, s.key)); else {
            const t = s.data.field(n.field);
            if (Ce(t)) throw new L(B.INVALID_ARGUMENT, 'Invalid query. You are trying to start or end a query using a document for which the field "' + n.field + '" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');
            if (null === t) {
                const t = n.field.canonicalString();
                throw new L(B.INVALID_ARGUMENT, `Invalid query. You are trying to start or end a query using a document for which the field '${t}' (used as the orderBy) does not exist.`);
            }
            r.push(t);
        }
        return new un(r, i);
    }
    /**
 * Converts a list of field values to a `Bound` for the given query.
 */ (t._query, t.firestore._databaseId, e, n[0]._document, s);
    {
        const i = qh(t.firestore);
        return function(t, e, n, s, i, r) {
            // Use explicit order by's because it has to match the query the user made
            const o = t.explicitOrderBy;
            if (i.length > o.length) throw new L(B.INVALID_ARGUMENT, `Too many arguments provided to ${s}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);
            const u = [];
            for (let r = 0; r < i.length; r++) {
                const c = i[r];
                if (o[r].field.isKeyField()) {
                    if ("string" != typeof c) throw new L(B.INVALID_ARGUMENT, `Invalid query. Expected a string for document ID in ${s}(), but got a ${typeof c}`);
                    if (!Qn(t) && -1 !== c.indexOf("/")) throw new L(B.INVALID_ARGUMENT, `Invalid query. When querying a collection and ordering by documentId(), the value passed to ${s}() must be a plain document ID, but '${c}' contains a slash.`);
                    const n = t.path.child(rt.fromString(c));
                    if (!ct.isDocumentKey(n)) throw new L(B.INVALID_ARGUMENT, `Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${s}() must result in a valid document path, but '${n}' is not because it contains an odd number of segments.`);
                    const i = new ct(n);
                    u.push(Qe(e, i));
                } else {
                    const t = Yh(n, s, c);
                    u.push(t);
                }
            }
            return new un(u, r);
        }
        /**
 * Parses the given `documentIdValue` into a `ReferenceValue`, throwing
 * appropriate errors if the value is anything other than a `DocumentReference`
 * or `string`, or if the string is malformed.
 */ (t._query, t.firestore._databaseId, i, e, n, s);
    }
}

function Cl(t, e, n) {
    if ("string" == typeof (n = getModularInstance(n))) {
        if ("" === n) throw new L(B.INVALID_ARGUMENT, "Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");
        if (!Qn(e) && -1 !== n.indexOf("/")) throw new L(B.INVALID_ARGUMENT, `Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);
        const s = e.path.child(rt.fromString(n));
        if (!ct.isDocumentKey(s)) throw new L(B.INVALID_ARGUMENT, `Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${s}' is not because it has an odd number of segments (${s.length}).`);
        return Qe(t, new ct(s));
    }
    if (n instanceof th) return Qe(t, n._key);
    throw new L(B.INVALID_ARGUMENT, `Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Wa(n)}.`);
}

/**
 * Validates that the value passed into a disjunctive filter satisfies all
 * array requirements.
 */ function xl(t, e) {
    if (!Array.isArray(t) || 0 === t.length) throw new L(B.INVALID_ARGUMENT, `Invalid Query. A non-empty array is required for '${e.toString()}' filters.`);
}

/**
 * Given an operator, returns the set of operators that cannot be used with it.
 *
 * This is not a comprehensive check, and this function should be removed in the
 * long term. Validations should occur in the Firestore backend.
 *
 * Operators in a query must adhere to the following set of rules:
 * 1. Only one inequality per query.
 * 2. `NOT_IN` cannot be used with array, disjunctive, or `NOT_EQUAL` operators.
 */ function Nl(t, e) {
    if (e.isInequality()) {
        const n = Gn(t), s = e.field;
        if (null !== n && !n.isEqual(s)) throw new L(B.INVALID_ARGUMENT, `Invalid query. All where filters with an inequality (<, <=, !=, not-in, >, or >=) must be on the same field. But you have inequality filters on '${n.toString()}' and '${s.toString()}'`);
        const i = Kn(t);
        null !== i && kl(t, s, i);
    }
    const n = function(t, e) {
        for (const n of t) for (const t of n.getFlattenedFilters()) if (e.indexOf(t.op) >= 0) return t.op;
        return null;
    }(t.filters, function(t) {
        switch (t) {
          case "!=" /* Operator.NOT_EQUAL */ :
            return [ "!=" /* Operator.NOT_EQUAL */ , "not-in" /* Operator.NOT_IN */ ];

          case "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ :
          case "in" /* Operator.IN */ :
            return [ "not-in" /* Operator.NOT_IN */ ];

          case "not-in" /* Operator.NOT_IN */ :
            return [ "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ , "in" /* Operator.IN */ , "not-in" /* Operator.NOT_IN */ , "!=" /* Operator.NOT_EQUAL */ ];

          default:
            return [];
        }
    }(e.op));
    if (null !== n) 
    // Special case when it's a duplicate op to give a slightly clearer error message.
    throw n === e.op ? new L(B.INVALID_ARGUMENT, `Invalid query. You cannot use more than one '${e.op.toString()}' filter.`) : new L(B.INVALID_ARGUMENT, `Invalid query. You cannot use '${e.op.toString()}' filters with '${n.toString()}' filters.`);
}

function kl(t, e, n) {
    if (!n.isEqual(e)) throw new L(B.INVALID_ARGUMENT, `Invalid query. You have a where filter with an inequality (<, <=, !=, not-in, >, or >=) on field '${e.toString()}' and so you must also use '${e.toString()}' as your first argument to orderBy(), but your first orderBy() is on field '${n.toString()}' instead.`);
}

function Ol(t, e) {
    if (!(e instanceof wl || e instanceof ml)) throw new L(B.INVALID_ARGUMENT, `Function ${t}() requires AppliableConstraints created with a call to 'where(...)', 'or(...)', or 'and(...)'.`);
}

class $l {
    convertValue(t, e = "none") {
        switch (Fe(t)) {
          case 0 /* TypeOrder.NullValue */ :
            return null;

          case 1 /* TypeOrder.BooleanValue */ :
            return t.booleanValue;

          case 2 /* TypeOrder.NumberValue */ :
            return Se(t.integerValue || t.doubleValue);

          case 3 /* TypeOrder.TimestampValue */ :
            return this.convertTimestamp(t.timestampValue);

          case 4 /* TypeOrder.ServerTimestampValue */ :
            return this.convertServerTimestamp(t, e);

          case 5 /* TypeOrder.StringValue */ :
            return t.stringValue;

          case 6 /* TypeOrder.BlobValue */ :
            return this.convertBytes(De(t.bytesValue));

          case 7 /* TypeOrder.RefValue */ :
            return this.convertReference(t.referenceValue);

          case 8 /* TypeOrder.GeoPointValue */ :
            return this.convertGeoPoint(t.geoPointValue);

          case 9 /* TypeOrder.ArrayValue */ :
            return this.convertArray(t.arrayValue, e);

          case 10 /* TypeOrder.ObjectValue */ :
            return this.convertObject(t.mapValue, e);

          default:
            throw O();
        }
    }
    convertObject(t, e) {
        const n = {};
        return _e(t.fields, ((t, s) => {
            n[t] = this.convertValue(s, e);
        })), n;
    }
    convertGeoPoint(t) {
        return new kh(Se(t.latitude), Se(t.longitude));
    }
    convertArray(t, e) {
        return (t.values || []).map((t => this.convertValue(t, e)));
    }
    convertServerTimestamp(t, e) {
        switch (e) {
          case "previous":
            const n = xe(t);
            return null == n ? null : this.convertValue(n, e);

          case "estimate":
            return this.convertTimestamp(Ne(t));

          default:
            return null;
        }
    }
    convertTimestamp(t) {
        const e = Ve(t);
        return new nt(e.seconds, e.nanos);
    }
    convertDocumentKey(t, e) {
        const n = rt.fromString(t);
        $(Xi(n));
        const s = new Oe(n.get(1), n.get(3)), i = new ct(n.popFirst(5));
        return s.isEqual(e) || 
        // TODO(b/64130202): Somehow support foreign references.
        x(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`), 
        i;
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Converts custom model object of type T into `DocumentData` by applying the
 * converter if it exists.
 *
 * This function is used when converting user objects to `DocumentData`
 * because we want to provide the user with a more specific error message if
 * their `set()` or fails due to invalid data originating from a `toFirestore()`
 * call.
 */ function Ml(t, e, n) {
    let s;
    // Cast to `any` in order to satisfy the union type constraint on
    // toFirestore().
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return s = t ? n && (n.merge || n.mergeFields) ? t.toFirestore(e, n) : t.toFirestore(e) : e, 
    s;
}

class Fl extends $l {
    constructor(t) {
        super(), this.firestore = t;
    }
    convertBytes(t) {
        return new Dh(t);
    }
    convertReference(t) {
        const e = this.convertDocumentKey(t, this.firestore._databaseId);
        return new th(this.firestore, /* converter= */ null, e);
    }
}

/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Create an AggregateField object that can be used to compute the sum of
 * a specified field over a range of documents in the result set of a query.
 * @param field Specifies the field to sum across the result set.
 * @internal TODO (sum/avg) remove when public
 */ function Bl(t) {
    return new Vh("sum", nl("sum", t));
}

/**
 * Create an AggregateField object that can be used to compute the average of
 * a specified field over a range of documents in the result set of a query.
 * @param field Specifies the field to average across the result set.
 * @internal TODO (sum/avg) remove when public
 */ function Ll(t) {
    return new Vh("avg", nl("average", t));
}

/**
 * Create an AggregateField object that can be used to compute the count of
 * documents in the result set of a query.
 * @internal TODO (sum/avg) remove when public
 */ function ql() {
    return new Vh("count");
}

/**
 * Compares two 'AggregateField` instances for equality.
 *
 * @param left Compare this AggregateField to the `right`.
 * @param right Compare this AggregateField to the `left`.
 * @internal TODO (sum/avg) remove when public
 */ function Ul(t, e) {
    var n, s;
    return t instanceof Vh && e instanceof Vh && t._aggregateType === e._aggregateType && (null === (n = t._internalFieldPath) || void 0 === n ? void 0 : n.canonicalString()) === (null === (s = e._internalFieldPath) || void 0 === s ? void 0 : s.canonicalString());
}

/**
 * Compares two `AggregateQuerySnapshot` instances for equality.
 *
 * Two `AggregateQuerySnapshot` instances are considered "equal" if they have
 * underlying queries that compare equal, and the same data.
 *
 * @param left - The first `AggregateQuerySnapshot` to compare.
 * @param right - The second `AggregateQuerySnapshot` to compare.
 *
 * @returns `true` if the objects are "equal", as defined above, or `false`
 * otherwise.
 */ function Kl(t, e) {
    return uh(t.query, e.query) && deepEqual(t.data(), e.data());
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Metadata about a snapshot, describing the state of the snapshot.
 */ class Gl {
    /** @hideconstructor */
    constructor(t, e) {
        this.hasPendingWrites = t, this.fromCache = e;
    }
    /**
     * Returns true if this `SnapshotMetadata` is equal to the provided one.
     *
     * @param other - The `SnapshotMetadata` to compare against.
     * @returns true if this `SnapshotMetadata` is equal to the provided one.
     */    isEqual(t) {
        return this.hasPendingWrites === t.hasPendingWrites && this.fromCache === t.fromCache;
    }
}

/**
 * A `DocumentSnapshot` contains data read from a document in your Firestore
 * database. The data can be extracted with `.data()` or `.get(<field>)` to
 * get a specific field.
 *
 * For a `DocumentSnapshot` that points to a non-existing document, any data
 * access will return 'undefined'. You can use the `exists()` method to
 * explicitly verify a document's existence.
 */ class Ql extends ul {
    /** @hideconstructor protected */
    constructor(t, e, n, s, i, r) {
        super(t, e, n, s, r), this._firestore = t, this._firestoreImpl = t, this.metadata = i;
    }
    /**
     * Returns whether or not the data exists. True if the document exists.
     */    exists() {
        return super.exists();
    }
    /**
     * Retrieves all fields in the document as an `Object`. Returns `undefined` if
     * the document doesn't exist.
     *
     * By default, `serverTimestamp()` values that have not yet been
     * set to their final value will be returned as `null`. You can override
     * this by passing an options object.
     *
     * @param options - An options object to configure how data is retrieved from
     * the snapshot (for example the desired behavior for server timestamps that
     * have not yet been set to their final value).
     * @returns An `Object` containing all fields in the document or `undefined` if
     * the document doesn't exist.
     */    data(t = {}) {
        if (this._document) {
            if (this._converter) {
                // We only want to use the converter and create a new DocumentSnapshot
                // if a converter has been provided.
                const e = new zl(this._firestore, this._userDataWriter, this._key, this._document, this.metadata, 
                /* converter= */ null);
                return this._converter.fromFirestore(e, t);
            }
            return this._userDataWriter.convertValue(this._document.data.value, t.serverTimestamps);
        }
    }
    /**
     * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
     * document or field doesn't exist.
     *
     * By default, a `serverTimestamp()` that has not yet been set to
     * its final value will be returned as `null`. You can override this by
     * passing an options object.
     *
     * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
     * field.
     * @param options - An options object to configure how the field is retrieved
     * from the snapshot (for example the desired behavior for server timestamps
     * that have not yet been set to their final value).
     * @returns The data at the specified field location or undefined if no such
     * field exists in the document.
     */
    // We are using `any` here to avoid an explicit cast by our users.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(t, e = {}) {
        if (this._document) {
            const n = this._document.data.field(al("DocumentSnapshot.get", t));
            if (null !== n) return this._userDataWriter.convertValue(n, e.serverTimestamps);
        }
    }
}

/**
 * A `QueryDocumentSnapshot` contains data read from a document in your
 * Firestore database as part of a query. The document is guaranteed to exist
 * and its data can be extracted with `.data()` or `.get(<field>)` to get a
 * specific field.
 *
 * A `QueryDocumentSnapshot` offers the same API surface as a
 * `DocumentSnapshot`. Since query results contain only existing documents, the
 * `exists` property will always be true and `data()` will never return
 * 'undefined'.
 */ class zl extends Ql {
    /**
     * Retrieves all fields in the document as an `Object`.
     *
     * By default, `serverTimestamp()` values that have not yet been
     * set to their final value will be returned as `null`. You can override
     * this by passing an options object.
     *
     * @override
     * @param options - An options object to configure how data is retrieved from
     * the snapshot (for example the desired behavior for server timestamps that
     * have not yet been set to their final value).
     * @returns An `Object` containing all fields in the document.
     */
    data(t = {}) {
        return super.data(t);
    }
}

/**
 * A `QuerySnapshot` contains zero or more `DocumentSnapshot` objects
 * representing the results of a query. The documents can be accessed as an
 * array via the `docs` property or enumerated using the `forEach` method. The
 * number of documents can be determined via the `empty` and `size`
 * properties.
 */ class jl {
    /** @hideconstructor */
    constructor(t, e, n, s) {
        this._firestore = t, this._userDataWriter = e, this._snapshot = s, this.metadata = new Gl(s.hasPendingWrites, s.fromCache), 
        this.query = n;
    }
    /** An array of all the documents in the `QuerySnapshot`. */    get docs() {
        const t = [];
        return this.forEach((e => t.push(e))), t;
    }
    /** The number of documents in the `QuerySnapshot`. */    get size() {
        return this._snapshot.docs.size;
    }
    /** True if there are no documents in the `QuerySnapshot`. */    get empty() {
        return 0 === this.size;
    }
    /**
     * Enumerates all of the documents in the `QuerySnapshot`.
     *
     * @param callback - A callback to be called with a `QueryDocumentSnapshot` for
     * each document in the snapshot.
     * @param thisArg - The `this` binding for the callback.
     */    forEach(t, e) {
        this._snapshot.docs.forEach((n => {
            t.call(e, new zl(this._firestore, this._userDataWriter, n.key, n, new Gl(this._snapshot.mutatedKeys.has(n.key), this._snapshot.fromCache), this.query.converter));
        }));
    }
    /**
     * Returns an array of the documents changes since the last snapshot. If this
     * is the first snapshot, all documents will be in the list as 'added'
     * changes.
     *
     * @param options - `SnapshotListenOptions` that control whether metadata-only
     * changes (i.e. only `DocumentSnapshot.metadata` changed) should trigger
     * snapshot events.
     */    docChanges(t = {}) {
        const e = !!t.includeMetadataChanges;
        if (e && this._snapshot.excludesMetadataChanges) throw new L(B.INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
        return this._cachedChanges && this._cachedChangesIncludeMetadataChanges === e || (this._cachedChanges = 
        /** Calculates the array of `DocumentChange`s for a given `ViewSnapshot`. */
        function(t, e) {
            if (t._snapshot.oldDocs.isEmpty()) {
                let e = 0;
                return t._snapshot.docChanges.map((n => {
                    const s = new zl(t._firestore, t._userDataWriter, n.doc.key, n.doc, new Gl(t._snapshot.mutatedKeys.has(n.doc.key), t._snapshot.fromCache), t.query.converter);
                    return n.doc, {
                        type: "added",
                        doc: s,
                        oldIndex: -1,
                        newIndex: e++
                    };
                }));
            }
            {
                // A `DocumentSet` that is updated incrementally as changes are applied to use
                // to lookup the index of a document.
                let n = t._snapshot.oldDocs;
                return t._snapshot.docChanges.filter((t => e || 3 /* ChangeType.Metadata */ !== t.type)).map((e => {
                    const s = new zl(t._firestore, t._userDataWriter, e.doc.key, e.doc, new Gl(t._snapshot.mutatedKeys.has(e.doc.key), t._snapshot.fromCache), t.query.converter);
                    let i = -1, r = -1;
                    return 0 /* ChangeType.Added */ !== e.type && (i = n.indexOf(e.doc.key), n = n.delete(e.doc.key)), 
                    1 /* ChangeType.Removed */ !== e.type && (n = n.add(e.doc), r = n.indexOf(e.doc.key)), 
                    {
                        type: Wl(e.type),
                        doc: s,
                        oldIndex: i,
                        newIndex: r
                    };
                }));
            }
        }(this, e), this._cachedChangesIncludeMetadataChanges = e), this._cachedChanges;
    }
}

function Wl(t) {
    switch (t) {
      case 0 /* ChangeType.Added */ :
        return "added";

      case 2 /* ChangeType.Modified */ :
      case 3 /* ChangeType.Metadata */ :
        return "modified";

      case 1 /* ChangeType.Removed */ :
        return "removed";

      default:
        return O();
    }
}

// TODO(firestoreexp): Add tests for snapshotEqual with different snapshot
// metadata
/**
 * Returns true if the provided snapshots are equal.
 *
 * @param left - A snapshot to compare.
 * @param right - A snapshot to compare.
 * @returns true if the snapshots are equal.
 */ function Hl(t, e) {
    return t instanceof Ql && e instanceof Ql ? t._firestore === e._firestore && t._key.isEqual(e._key) && (null === t._document ? null === e._document : t._document.isEqual(e._document)) && t._converter === e._converter : t instanceof jl && e instanceof jl && (t._firestore === e._firestore && uh(t.query, e.query) && t.metadata.isEqual(e.metadata) && t._snapshot.isEqual(e._snapshot));
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Reads the document referred to by this `DocumentReference`.
 *
 * Note: `getDoc()` attempts to provide up-to-date data when possible by waiting
 * for data from the server, but it may return cached data or fail if you are
 * offline and the server cannot be reached. To specify this behavior, invoke
 * {@link getDocFromCache} or {@link getDocFromServer}.
 *
 * @param reference - The reference of the document to fetch.
 * @returns A Promise resolved with a `DocumentSnapshot` containing the
 * current document contents.
 */ function Jl(t) {
    t = Ha(t, th);
    const e = Ha(t.firestore, fh);
    return $a(_h(e), t._key).then((n => lf(e, t, n)));
}

class Yl extends $l {
    constructor(t) {
        super(), this.firestore = t;
    }
    convertBytes(t) {
        return new Dh(t);
    }
    convertReference(t) {
        const e = this.convertDocumentKey(t, this.firestore._databaseId);
        return new th(this.firestore, /* converter= */ null, e);
    }
}

/**
 * Reads the document referred to by this `DocumentReference` from cache.
 * Returns an error if the document is not currently cached.
 *
 * @returns A `Promise` resolved with a `DocumentSnapshot` containing the
 * current document contents.
 */ function Zl(t) {
    t = Ha(t, th);
    const e = Ha(t.firestore, fh), n = _h(e), s = new Yl(e);
    return Oa(n, t._key).then((n => new Ql(e, s, t._key, n, new Gl(null !== n && n.hasLocalMutations, 
    /* fromCache= */ !0), t.converter)));
}

/**
 * Reads the document referred to by this `DocumentReference` from the server.
 * Returns an error if the network is not available.
 *
 * @returns A `Promise` resolved with a `DocumentSnapshot` containing the
 * current document contents.
 */ function Xl(t) {
    t = Ha(t, th);
    const e = Ha(t.firestore, fh);
    return $a(_h(e), t._key, {
        source: "server"
    }).then((n => lf(e, t, n)));
}

/**
 * Executes the query and returns the results as a `QuerySnapshot`.
 *
 * Note: `getDocs()` attempts to provide up-to-date data when possible by
 * waiting for data from the server, but it may return cached data or fail if
 * you are offline and the server cannot be reached. To specify this behavior,
 * invoke {@link getDocsFromCache} or {@link getDocsFromServer}.
 *
 * @returns A `Promise` that will be resolved with the results of the query.
 */ function tf(t) {
    t = Ha(t, eh);
    const e = Ha(t.firestore, fh), n = _h(e), s = new Yl(e);
    return hl(t._query), Fa(n, t._query).then((n => new jl(e, s, t, n)));
}

/**
 * Executes the query and returns the results as a `QuerySnapshot` from cache.
 * Returns an empty result set if no documents matching the query are currently
 * cached.
 *
 * @returns A `Promise` that will be resolved with the results of the query.
 */ function ef(t) {
    t = Ha(t, eh);
    const e = Ha(t.firestore, fh), n = _h(e), s = new Yl(e);
    return Ma(n, t._query).then((n => new jl(e, s, t, n)));
}

/**
 * Executes the query and returns the results as a `QuerySnapshot` from the
 * server. Returns an error if the network is not available.
 *
 * @returns A `Promise` that will be resolved with the results of the query.
 */ function nf(t) {
    t = Ha(t, eh);
    const e = Ha(t.firestore, fh), n = _h(e), s = new Yl(e);
    return Fa(n, t._query, {
        source: "server"
    }).then((n => new jl(e, s, t, n)));
}

function sf(t, e, n) {
    t = Ha(t, th);
    const s = Ha(t.firestore, fh), i = Ml(t.converter, e, n);
    return hf(s, [ Uh(qh(s), "setDoc", t._key, i, null !== t.converter, n).toMutation(t._key, Os.none()) ]);
}

function rf(t, e, n, ...s) {
    t = Ha(t, th);
    const i = Ha(t.firestore, fh), r = qh(i);
    let o;
    o = "string" == typeof (
    // For Compat types, we have to "extract" the underlying types before
    // performing validation.
    e = getModularInstance(e)) || e instanceof Ch ? Jh(r, "updateDoc", t._key, e, n, s) : Hh(r, "updateDoc", t._key, e);
    return hf(i, [ o.toMutation(t._key, Os.exists(!0)) ]);
}

/**
 * Deletes the document referred to by the specified `DocumentReference`.
 *
 * @param reference - A reference to the document to delete.
 * @returns A Promise resolved once the document has been successfully
 * deleted from the backend (note that it won't resolve while you're offline).
 */ function of(t) {
    return hf(Ha(t.firestore, fh), [ new Ws(t._key, Os.none()) ]);
}

/**
 * Add a new document to specified `CollectionReference` with the given data,
 * assigning it a document ID automatically.
 *
 * @param reference - A reference to the collection to add this document to.
 * @param data - An Object containing the data for the new document.
 * @returns A `Promise` resolved with a `DocumentReference` pointing to the
 * newly created document after it has been written to the backend (Note that it
 * won't resolve while you're offline).
 */ function uf(t, e) {
    const n = Ha(t.firestore, fh), s = rh(t), i = Ml(t.converter, e);
    return hf(n, [ Uh(qh(t.firestore), "addDoc", s._key, i, null !== t.converter, {}).toMutation(s._key, Os.exists(!1)) ]).then((() => s));
}

function cf(t, ...e) {
    var n, s, i;
    t = getModularInstance(t);
    let r = {
        includeMetadataChanges: !1
    }, o = 0;
    "object" != typeof e[o] || ah(e[o]) || (r = e[o], o++);
    const u = {
        includeMetadataChanges: r.includeMetadataChanges
    };
    if (ah(e[o])) {
        const t = e[o];
        e[o] = null === (n = t.next) || void 0 === n ? void 0 : n.bind(t), e[o + 1] = null === (s = t.error) || void 0 === s ? void 0 : s.bind(t), 
        e[o + 2] = null === (i = t.complete) || void 0 === i ? void 0 : i.bind(t);
    }
    let c, a, h;
    if (t instanceof th) a = Ha(t.firestore, fh), h = qn(t._key.path), c = {
        next: n => {
            e[o] && e[o](lf(a, t, n));
        },
        error: e[o + 1],
        complete: e[o + 2]
    }; else {
        const n = Ha(t, eh);
        a = Ha(n.firestore, fh), h = n._query;
        const s = new Yl(a);
        c = {
            next: t => {
                e[o] && e[o](new jl(a, s, n, t));
            },
            error: e[o + 1],
            complete: e[o + 2]
        }, hl(t._query);
    }
    return function(t, e, n, s) {
        const i = new ga(s), r = new Ac(e, i, n);
        return t.asyncQueue.enqueueAndForget((async () => yc(await xa(t), r))), () => {
            i.yc(), t.asyncQueue.enqueueAndForget((async () => pc(await xa(t), r)));
        };
    }(_h(a), h, u, c);
}

function af(t, e) {
    return Ba(_h(t = Ha(t, fh)), ah(e) ? e : {
        next: e
    });
}

/**
 * Locally writes `mutations` on the async queue.
 * @internal
 */ function hf(t, e) {
    return function(t, e) {
        const n = new q;
        return t.asyncQueue.enqueueAndForget((async () => Mc(await Da(t), e, n))), n.promise;
    }(_h(t), e);
}

/**
 * Converts a {@link ViewSnapshot} that contains the single document specified by `ref`
 * to a {@link DocumentSnapshot}.
 */ function lf(t, e, n) {
    const s = n.docs.get(e._key), i = new Yl(t);
    return new Ql(t, i, e._key, s, new Gl(n.hasPendingWrites, n.fromCache), e.converter);
}

/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Calculates the number of documents in the result set of the given query,
 * without actually downloading the documents.
 *
 * Using this function to count the documents is efficient because only the
 * final count, not the documents' data, is downloaded. This function can even
 * count the documents if the result set would be prohibitively large to
 * download entirely (e.g. thousands of documents).
 *
 * The result received from the server is presented, unaltered, without
 * considering any local state. That is, documents in the local cache are not
 * taken into consideration, neither are local modifications not yet
 * synchronized with the server. Previously-downloaded results, if any, are not
 * used: every request using this source necessarily involves a round trip to
 * the server.
 *
 * @param query - The query whose result set size to calculate.
 * @returns A Promise that will be resolved with the count; the count can be
 * retrieved from `snapshot.data().count`, where `snapshot` is the
 * `AggregateQuerySnapshot` to which the returned Promise resolves.
 */ function ff(t) {
    return df(t, {
        count: ql()
    });
}

/**
 * Calculates the specified aggregations over the documents in the result
 * set of the given query, without actually downloading the documents.
 *
 * Using this function to perform aggregations is efficient because only the
 * final aggregation values, not the documents' data, is downloaded. This
 * function can even perform aggregations of the documents if the result set
 * would be prohibitively large to download entirely (e.g. thousands of documents).
 *
 * The result received from the server is presented, unaltered, without
 * considering any local state. That is, documents in the local cache are not
 * taken into consideration, neither are local modifications not yet
 * synchronized with the server. Previously-downloaded results, if any, are not
 * used: every request using this source necessarily involves a round trip to
 * the server.
 *
 * @param query The query whose result set to aggregate over.
 * @param aggregateSpec An `AggregateSpec` object that specifies the aggregates
 * to perform over the result set. The AggregateSpec specifies aliases for each
 * aggregate, which can be used to retrieve the aggregate result.
 * @example
 * ```typescript
 * const aggregateSnapshot = await getAggregateFromServer(query, {
 *   countOfDocs: count(),
 *   totalHours: sum('hours'),
 *   averageScore: average('score')
 * });
 *
 * const countOfDocs: number = aggregateSnapshot.data().countOfDocs;
 * const totalHours: number = aggregateSnapshot.data().totalHours;
 * const averageScore: number | null = aggregateSnapshot.data().averageScore;
 * ```
 * @internal TODO (sum/avg) remove when public
 */ function df(t, e) {
    const n = Ha(t.firestore, fh), s = _h(n), i = function(t, e) {
        const n = [];
        for (const s in t) Object.prototype.hasOwnProperty.call(t, s) && n.push(e(t[s], s, t));
        return n;
    }(e, ((t, e) => new ei(new ti(e), t._aggregateType, t._internalFieldPath)));
    // Run the aggregation and convert the results
    return function(t, e, n) {
        const s = new q;
        return t.asyncQueue.enqueueAndForget((async () => {
            // TODO (sum/avg) should we update this to use the event manager?
            // Implement and call executeAggregateQueryViaSnapshotListener, similar
            // to the implementation in firestoreClientGetDocumentsViaSnapshotListener
            // above
            try {
                // TODO(b/277628384): check `canUseNetwork()` and handle multi-tab.
                const i = await Ca(t);
                s.resolve(ku(i, e, n));
            } catch (t) {
                s.reject(t);
            }
        })), s.promise;
    }(s, t._query, i).then((e => 
    /**
 * Converts the core aggregration result to an `AggregateQuerySnapshot`
 * that can be returned to the consumer.
 * @param query
 * @param aggregateResult Core aggregation result
 * @internal
 */
    function(t, e, n) {
        const s = new Yl(t);
        return new Sh(e, s, n);
    }
    /**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ (n, t, e)));
}

class wf {
    constructor() {
        this.kind = "memory", this._onlineComponentProvider = new _a, this._offlineComponentProvider = new fa;
    }
    toJSON() {
        return {
            kind: this.kind
        };
    }
}

class _f {
    constructor(t) {
        let e;
        this.kind = "persistent", (null == t ? void 0 : t.tabManager) ? (t.tabManager._initialize(t), 
        e = t.tabManager) : (e = If(void 0), e._initialize(t)), this._onlineComponentProvider = e._onlineComponentProvider, 
        this._offlineComponentProvider = e._offlineComponentProvider;
    }
    toJSON() {
        return {
            kind: this.kind
        };
    }
}

/**
 * Creates an instance of `MemoryLocalCache`. The instance can be set to
 * `FirestoreSettings.cache` to tell the SDK which cache layer to use.
 */ function mf() {
    return new wf;
}

/**
 * Creates an instance of `PersistentLocalCache`. The instance can be set to
 * `FirestoreSettings.cache` to tell the SDK which cache layer to use.
 */ function gf(t) {
    return new _f(t);
}

class yf {
    constructor(t) {
        this.forceOwnership = t, this.kind = "persistentSingleTab";
    }
    toJSON() {
        return {
            kind: this.kind
        };
    }
    /**
     * @internal
     */    _initialize(t) {
        this._onlineComponentProvider = new _a, this._offlineComponentProvider = new da(this._onlineComponentProvider, null == t ? void 0 : t.cacheSizeBytes, this.forceOwnership);
    }
}

class pf {
    constructor() {
        this.kind = "PersistentMultipleTab";
    }
    toJSON() {
        return {
            kind: this.kind
        };
    }
    /**
     * @internal
     */    _initialize(t) {
        this._onlineComponentProvider = new _a, this._offlineComponentProvider = new wa(this._onlineComponentProvider, null == t ? void 0 : t.cacheSizeBytes);
    }
}

/**
 * Creates an instance of `PersistentSingleTabManager`.
 *
 * @param settings Configures the created tab manager.
 */ function If(t) {
    return new yf(null == t ? void 0 : t.forceOwnership);
}

/**
 * Creates an instance of `PersistentMultipleTabManager`.
 */ function Tf() {
    return new pf;
}

/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Ef = {
    maxAttempts: 5
};

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A write batch, used to perform multiple writes as a single atomic unit.
 *
 * A `WriteBatch` object can be acquired by calling {@link writeBatch}. It
 * provides methods for adding writes to the write batch. None of the writes
 * will be committed (or visible locally) until {@link WriteBatch.commit} is
 * called.
 */
class Af {
    /** @hideconstructor */
    constructor(t, e) {
        this._firestore = t, this._commitHandler = e, this._mutations = [], this._committed = !1, 
        this._dataReader = qh(t);
    }
    set(t, e, n) {
        this._verifyNotCommitted();
        const s = Rf(t, this._firestore), i = Ml(s.converter, e, n), r = Uh(this._dataReader, "WriteBatch.set", s._key, i, null !== s.converter, n);
        return this._mutations.push(r.toMutation(s._key, Os.none())), this;
    }
    update(t, e, n, ...s) {
        this._verifyNotCommitted();
        const i = Rf(t, this._firestore);
        // For Compat types, we have to "extract" the underlying types before
        // performing validation.
                let r;
        return r = "string" == typeof (e = getModularInstance(e)) || e instanceof Ch ? Jh(this._dataReader, "WriteBatch.update", i._key, e, n, s) : Hh(this._dataReader, "WriteBatch.update", i._key, e), 
        this._mutations.push(r.toMutation(i._key, Os.exists(!0))), this;
    }
    /**
     * Deletes the document referred to by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be deleted.
     * @returns This `WriteBatch` instance. Used for chaining method calls.
     */    delete(t) {
        this._verifyNotCommitted();
        const e = Rf(t, this._firestore);
        return this._mutations = this._mutations.concat(new Ws(e._key, Os.none())), this;
    }
    /**
     * Commits all of the writes in this write batch as a single atomic unit.
     *
     * The result of these writes will only be reflected in document reads that
     * occur after the returned promise resolves. If the client is offline, the
     * write fails. If you would like to see local modifications or buffer writes
     * until the client is online, use the full Firestore SDK.
     *
     * @returns A `Promise` resolved once all of the writes in the batch have been
     * successfully written to the backend as an atomic unit (note that it won't
     * resolve while you're offline).
     */    commit() {
        return this._verifyNotCommitted(), this._committed = !0, this._mutations.length > 0 ? this._commitHandler(this._mutations) : Promise.resolve();
    }
    _verifyNotCommitted() {
        if (this._committed) throw new L(B.FAILED_PRECONDITION, "A write batch can no longer be used after commit() has been called.");
    }
}

function Rf(t, e) {
    if ((t = getModularInstance(t)).firestore !== e) throw new L(B.INVALID_ARGUMENT, "Provided document reference is from a different Firestore instance.");
    return t;
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// TODO(mrschmidt) Consider using `BaseTransaction` as the base class in the
// legacy SDK.
/**
 * A reference to a transaction.
 *
 * The `Transaction` object passed to a transaction's `updateFunction` provides
 * the methods to read and write data within the transaction context. See
 * {@link runTransaction}.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A reference to a transaction.
 *
 * The `Transaction` object passed to a transaction's `updateFunction` provides
 * the methods to read and write data within the transaction context. See
 * {@link runTransaction}.
 */
class vf extends class {
    /** @hideconstructor */
    constructor(t, e) {
        this._firestore = t, this._transaction = e, this._dataReader = qh(t);
    }
    /**
     * Reads the document referenced by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be read.
     * @returns A `DocumentSnapshot` with the read data.
     */    get(t) {
        const e = Rf(t, this._firestore), n = new Fl(this._firestore);
        return this._transaction.lookup([ e._key ]).then((t => {
            if (!t || 1 !== t.length) return O();
            const s = t[0];
            if (s.isFoundDocument()) return new ul(this._firestore, n, s.key, s, e.converter);
            if (s.isNoDocument()) return new ul(this._firestore, n, e._key, null, e.converter);
            throw O();
        }));
    }
    set(t, e, n) {
        const s = Rf(t, this._firestore), i = Ml(s.converter, e, n), r = Uh(this._dataReader, "Transaction.set", s._key, i, null !== s.converter, n);
        return this._transaction.set(s._key, r), this;
    }
    update(t, e, n, ...s) {
        const i = Rf(t, this._firestore);
        // For Compat types, we have to "extract" the underlying types before
        // performing validation.
                let r;
        return r = "string" == typeof (e = getModularInstance(e)) || e instanceof Ch ? Jh(this._dataReader, "Transaction.update", i._key, e, n, s) : Hh(this._dataReader, "Transaction.update", i._key, e), 
        this._transaction.update(i._key, r), this;
    }
    /**
     * Deletes the document referred to by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be deleted.
     * @returns This `Transaction` instance. Used for chaining method calls.
     */    delete(t) {
        const e = Rf(t, this._firestore);
        return this._transaction.delete(e._key), this;
    }
} {
    // This class implements the same logic as the Transaction API in the Lite SDK
    // but is subclassed in order to return its own DocumentSnapshot types.
    /** @hideconstructor */
    constructor(t, e) {
        super(t, e), this._firestore = t;
    }
    /**
     * Reads the document referenced by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be read.
     * @returns A `DocumentSnapshot` with the read data.
     */    get(t) {
        const e = Rf(t, this._firestore), n = new Yl(this._firestore);
        return super.get(t).then((t => new Ql(this._firestore, n, e._key, t._document, new Gl(
        /* hasPendingWrites= */ !1, 
        /* fromCache= */ !1), e.converter)));
    }
}

/**
 * Executes the given `updateFunction` and then attempts to commit the changes
 * applied within the transaction. If any document read within the transaction
 * has changed, Cloud Firestore retries the `updateFunction`. If it fails to
 * commit after 5 attempts, the transaction fails.
 *
 * The maximum number of writes allowed in a single transaction is 500.
 *
 * @param firestore - A reference to the Firestore database to run this
 * transaction against.
 * @param updateFunction - The function to execute within the transaction
 * context.
 * @param options - An options object to configure maximum number of attempts to
 * commit.
 * @returns If the transaction completed successfully or was explicitly aborted
 * (the `updateFunction` returned a failed promise), the promise returned by the
 * `updateFunction `is returned here. Otherwise, if the transaction failed, a
 * rejected promise with the corresponding failure error is returned.
 */ function bf(t, e, n) {
    t = Ha(t, fh);
    const s = Object.assign(Object.assign({}, Ef), n);
    !function(t) {
        if (t.maxAttempts < 1) throw new L(B.INVALID_ARGUMENT, "Max attempts must be at least 1");
    }(s);
    return function(t, e, n) {
        const s = new q;
        return t.asyncQueue.enqueueAndForget((async () => {
            const i = await Ca(t);
            new Ia(t.asyncQueue, i, n, e, s).run();
        })), s.promise;
    }(_h(t), (n => e(new vf(t, n))), s);
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Returns a sentinel for use with {@link @firebase/firestore/lite#(updateDoc:1)} or
 * {@link @firebase/firestore/lite#(setDoc:1)} with `{merge: true}` to mark a field for deletion.
 */ function Pf() {
    return new Kh("deleteField");
}

/**
 * Returns a sentinel used with {@link @firebase/firestore/lite#(setDoc:1)} or {@link @firebase/firestore/lite#(updateDoc:1)} to
 * include a server-generated timestamp in the written data.
 */ function Vf() {
    return new Qh("serverTimestamp");
}

/**
 * Returns a special value that can be used with {@link @firebase/firestore/lite#(setDoc:1)} or {@link
 * @firebase/firestore/lite#(updateDoc:1)} that tells the server to union the given elements with any array
 * value that already exists on the server. Each specified element that doesn't
 * already exist in the array will be added to the end. If the field being
 * modified is not already an array it will be overwritten with an array
 * containing exactly the specified elements.
 *
 * @param elements - The elements to union into the array.
 * @returns The `FieldValue` sentinel for use in a call to `setDoc()` or
 * `updateDoc()`.
 */ function Sf(...t) {
    // NOTE: We don't actually parse the data until it's used in set() or
    // update() since we'd need the Firestore instance to do this.
    return new zh("arrayUnion", t);
}

/**
 * Returns a special value that can be used with {@link (setDoc:1)} or {@link
 * updateDoc:1} that tells the server to remove the given elements from any
 * array value that already exists on the server. All instances of each element
 * specified will be removed from the array. If the field being modified is not
 * already an array it will be overwritten with an empty array.
 *
 * @param elements - The elements to remove from the array.
 * @returns The `FieldValue` sentinel for use in a call to `setDoc()` or
 * `updateDoc()`
 */ function Df(...t) {
    // NOTE: We don't actually parse the data until it's used in set() or
    // update() since we'd need the Firestore instance to do this.
    return new jh("arrayRemove", t);
}

/**
 * Returns a special value that can be used with {@link @firebase/firestore/lite#(setDoc:1)} or {@link
 * @firebase/firestore/lite#(updateDoc:1)} that tells the server to increment the field's current value by
 * the given value.
 *
 * If either the operand or the current field value uses floating point
 * precision, all arithmetic follows IEEE 754 semantics. If both values are
 * integers, values outside of JavaScript's safe number range
 * (`Number.MIN_SAFE_INTEGER` to `Number.MAX_SAFE_INTEGER`) are also subject to
 * precision loss. Furthermore, once processed by the Firestore backend, all
 * integer operations are capped between -2^63 and 2^63-1.
 *
 * If the current field value is not of type `number`, or if the field does not
 * yet exist, the transformation sets the field to the given value.
 *
 * @param n - The value to increment by.
 * @returns The `FieldValue` sentinel for use in a call to `setDoc()` or
 * `updateDoc()`
 */ function Cf(t) {
    return new Wh("increment", t);
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Creates a write batch, used for performing multiple writes as a single
 * atomic operation. The maximum number of writes allowed in a single {@link WriteBatch}
 * is 500.
 *
 * Unlike transactions, write batches are persisted offline and therefore are
 * preferable when you don't need to condition your writes on read data.
 *
 * @returns A {@link WriteBatch} that can be used to atomically execute multiple
 * writes.
 */ function xf(t) {
    return _h(t = Ha(t, fh)), new Af(t, (e => hf(t, e)));
}

/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Nf(t, e) {
    var n;
    const s = _h(t = Ha(t, fh));
    if (!s._uninitializedComponentsProvider || "memory" === (null === (n = s._uninitializedComponentsProvider) || void 0 === n ? void 0 : n._offlineKind)) 
    // PORTING NOTE: We don't return an error if the user has not enabled
    // persistence since `enableIndexeddbPersistence()` can fail on the Web.
    return N("Cannot enable indexes when persistence is disabled"), Promise.resolve();
    const i = function(t) {
        const e = "string" == typeof t ? function(t) {
            try {
                return JSON.parse(t);
            } catch (t) {
                throw new L(B.INVALID_ARGUMENT, "Failed to parse JSON: " + (null == t ? void 0 : t.message));
            }
        }(t) : t, n = [];
        if (Array.isArray(e.indexes)) for (const t of e.indexes) {
            const e = kf(t, "collectionGroup"), s = [];
            if (Array.isArray(t.fields)) for (const e of t.fields) {
                const t = il("setIndexConfiguration", kf(e, "fieldPath"));
                "CONTAINS" === e.arrayConfig ? s.push(new dt(t, 2 /* IndexKind.CONTAINS */)) : "ASCENDING" === e.order ? s.push(new dt(t, 0 /* IndexKind.ASCENDING */)) : "DESCENDING" === e.order && s.push(new dt(t, 1 /* IndexKind.DESCENDING */));
            }
            n.push(new at(at.UNKNOWN_ID, e, s, _t.empty()));
        }
        return n;
    }(e);
    return Ua(s, i);
}

function kf(t, e) {
    if ("string" != typeof t[e]) throw new L(B.INVALID_ARGUMENT, "Missing string value for: " + e);
    return t[e];
}

/**
 * Cloud Firestore
 *
 * @packageDocumentation
 */ !function(t, e = !0) {
    !function(t) {
        P = t;
    }(SDK_VERSION), _registerComponent(new Component("firestore", ((t, {instanceIdentifier: n, options: s}) => {
        const i = t.getProvider("app").getImmediate(), r = new fh(new Q(t.getProvider("auth-internal")), new H(t.getProvider("app-check-internal")), function(t, e) {
            if (!Object.prototype.hasOwnProperty.apply(t.options, [ "projectId" ])) throw new L(B.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
            return new Oe(t.options.projectId, e);
        }(i, n), i);
        return s = Object.assign({
            useFetchStreams: e
        }, s), r._setSettings(s), r;
    }), "PUBLIC").setMultipleInstances(!0)), registerVersion(v, "3.10.1", t), 
    // BUILD_TARGET will be replaced by values like esm5, esm2017, cjs5, etc during the compilation
    registerVersion(v, "3.10.1", "esm2017");
}();

export { $l as AbstractUserDataWriter, Vh as AggregateField, Sh as AggregateQuerySnapshot, Dh as Bytes, lh as CACHE_SIZE_UNLIMITED, nh as CollectionReference, th as DocumentReference, Ql as DocumentSnapshot, Ch as FieldPath, Nh as FieldValue, fh as Firestore, L as FirestoreError, kh as GeoPoint, hh as LoadBundleTask, eh as Query, ml as QueryCompositeFilterConstraint, fl as QueryConstraint, zl as QueryDocumentSnapshot, Pl as QueryEndAtConstraint, wl as QueryFieldFilterConstraint, Tl as QueryLimitConstraint, pl as QueryOrderByConstraint, jl as QuerySnapshot, Rl as QueryStartAtConstraint, Gl as SnapshotMetadata, nt as Timestamp, vf as Transaction, Af as WriteBatch, Oe as _DatabaseId, ct as _DocumentKey, J as _EmptyAppCheckTokenProvider, K as _EmptyAuthCredentialsProvider, ut as _FieldPath, ui as _TestingHooks, Ha as _cast, M as _debugAssert, ve as _isBase64Available, N as _logWarn, Qa as _validateIsNotUsedTogether, uf as addDoc, Ul as aggregateFieldEqual, Kl as aggregateQuerySnapshotEqual, yl as and, Df as arrayRemove, Sf as arrayUnion, Ll as average, Ih as clearIndexedDbPersistence, sh as collection, ih as collectionGroup, Xa as connectFirestoreEmulator, ql as count, of as deleteDoc, Pf as deleteField, Ah as disableNetwork, rh as doc, xh as documentId, gh as enableIndexedDbPersistence, yh as enableMultiTabIndexedDbPersistence, Eh as enableNetwork, Sl as endAt, Vl as endBefore, _h as ensureFirestoreConfigured, hf as executeWrite, df as getAggregateFromServer, ff as getCountFromServer, Jl as getDoc, Zl as getDocFromCache, Xl as getDocFromServer, tf as getDocs, ef as getDocsFromCache, nf as getDocsFromServer, wh as getFirestore, Cf as increment, dh as initializeFirestore, El as limit, Al as limitToLast, vh as loadBundle, mf as memoryLocalCache, bh as namedQuery, cf as onSnapshot, af as onSnapshotsInSync, gl as or, Il as orderBy, gf as persistentLocalCache, Tf as persistentMultipleTabManager, If as persistentSingleTabManager, dl as query, uh as queryEqual, oh as refEqual, bf as runTransaction, Vf as serverTimestamp, sf as setDoc, Nf as setIndexConfiguration, D as setLogLevel, Hl as snapshotEqual, bl as startAfter, vl as startAt, Bl as sum, Rh as terminate, rf as updateDoc, Th as waitForPendingWrites, _l as where, xf as writeBatch };
//# sourceMappingURL=index.esm2017.js.map
