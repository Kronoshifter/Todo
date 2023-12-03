package com.kronos.utils

import com.github.michaelbull.result.*
import kotlin.contracts.ExperimentalContracts
import kotlin.contracts.InvocationKind
import kotlin.contracts.contract

@OptIn(ExperimentalContracts::class)
inline fun<V, E> Result<V, E>.guard(block: (E) -> Nothing): V {
  contract {
    callsInPlace(block, InvocationKind.AT_MOST_ONCE)
    returns() implies (this@guard is Ok<V>)
  }

  return when (this) {
    is Ok -> this.value
    is Err -> block(this.error)
  }
}

fun<K, V> MutableMap<K, V>.putIfPresent(key: K, value: V): V? = if (this.containsKey(key)) this.put(key, value) else null
