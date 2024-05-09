<script lang="ts" setup>
import { useTranslate } from '@Shared/translate';

// Import translations
const { t } = useTranslate('en');

const emits = defineEmits<{ (e: 'confirm'): void; (e: 'cancel'): void }>();
</script>

<template>
    <div class="flex h-screen w-screen items-center justify-center overflow-hidden text-neutral-950">
        <div class="w-1/3 rounded-lg bg-neutral-950 bg-opacity-70 p-3 shadow-lg">
            <div class="flex flex-col gap-4 text-center text-white">
                <span class="text-lg font-bold">
                    <slot></slot>
                </span>
                <div class="flex flex-row gap-3">
                    <button
                        class="h-12 w-full rounded-lg bg-white bg-opacity-20 px-6 text-center font-medium text-white shadow-md hover:bg-red-400 hover:bg-gradient-to-r hover:from-red-500 active:scale-95"
                        @click="emits('cancel')"
                    >
                        {{ t('character.select.cancel') }}
                    </button>
                    <button
                        class="h-12 w-full rounded-lg bg-white bg-opacity-20 px-6 text-center font-medium text-white shadow-md hover:bg-cyan-400 hover:bg-gradient-to-r hover:from-green-500 active:scale-95"
                        @click="emits('confirm')"
                    >
                        {{ t('character.select.confirm') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
