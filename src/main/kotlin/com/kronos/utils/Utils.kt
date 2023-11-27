package com.kronos.utils

import com.github.michaelbull.result.*

inline fun<V, E> Result<V, E>.guard(block: (E) -> Nothing): V {
  return when (this) {
    is Ok -> this.value
    is Err -> block(this.error)
  }
}
