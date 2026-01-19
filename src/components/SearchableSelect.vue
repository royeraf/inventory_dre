<template>
    <div class="relative" ref="containerRef">
        <!-- Campo de selección -->
        <div @click="toggleDropdown"
            class="w-full px-4 py-2.5 border rounded-lg cursor-pointer flex items-center justify-between transition-all duration-200"
            :class="[
                disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300' : 'bg-white border-gray-300 hover:border-blue-400',
                isOpen ? 'ring-2 ring-blue-500 border-transparent' : '',
                hasError ? 'border-red-500' : ''
            ]">
            <div class="flex items-center gap-2 flex-1 min-w-0">
                <span v-if="selectedItem" class="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                <span class="truncate" :class="selectedItem ? 'text-gray-800' : 'text-gray-400'">
                    {{ selectedItem?.nombre || placeholder }}
                </span>
            </div>
            <svg class="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200"
                :class="{ 'rotate-180': isOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        </div>

        <!-- Dropdown -->
        <Transition enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <div v-if="isOpen && !disabled"
                class="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                <!-- Campo de búsqueda -->
                <div class="p-2 border-b border-gray-100">
                    <div class="relative">
                        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input ref="searchInputRef" v-model="searchQuery" type="text" placeholder="Buscar..."
                            class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            @keydown.escape="closeDropdown" @keydown.enter.prevent="selectFirstFiltered" />
                    </div>
                </div>

                <!-- Lista de opciones -->
                <ul class="max-h-60 overflow-y-auto py-1 custom-scrollbar">
                    <li v-if="isLoading" class="px-4 py-3 text-sm text-gray-500 text-center">
                        <svg class="animate-spin h-5 w-5 mx-auto text-blue-600" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        <span class="mt-1 block">Cargando...</span>
                    </li>
                    <li v-else-if="filteredItems.length === 0" class="px-4 py-3 text-sm text-gray-500 text-center">
                        No se encontraron resultados
                    </li>
                    <li v-else v-for="item in filteredItems" :key="item.id" @click="selectItem(item)"
                        class="px-4 py-2.5 cursor-pointer flex items-center gap-3 hover:bg-blue-50 transition-colors duration-150"
                        :class="{ 'bg-blue-50': selectedItem?.id === item.id }">
                        <span class="w-2 h-2 rounded-full flex-shrink-0"
                            :class="selectedItem?.id === item.id ? 'bg-green-500' : 'bg-gray-300'"></span>
                        <span class="flex-1 truncate text-sm"
                            :class="selectedItem?.id === item.id ? 'text-blue-700 font-medium' : 'text-gray-700'">
                            {{ item.nombre }}
                        </span>
                        <svg v-if="selectedItem?.id === item.id" class="w-5 h-5 text-blue-600 flex-shrink-0"
                            fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                    </li>
                </ul>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';

interface SelectItem {
    id: number;
    nombre: string;
    [key: string]: any;
}

const props = defineProps<{
    items: SelectItem[];
    modelValue: string;
    placeholder?: string;
    disabled?: boolean;
    hasError?: boolean;
    isLoading?: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'change', item: SelectItem | null): void;
}>();

const isOpen = ref(false);
const searchQuery = ref('');
const containerRef = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);

// Encontrar el item seleccionado basado en modelValue (nombre)
const selectedItem = computed(() => {
    return props.items.find(item => item.nombre === props.modelValue) || null;
});

// Filtrar items basado en la búsqueda
const filteredItems = computed(() => {
    if (!searchQuery.value) return props.items;

    const query = searchQuery.value.toLowerCase().trim();
    return props.items.filter(item =>
        item.nombre.toLowerCase().includes(query)
    );
});

const toggleDropdown = () => {
    if (props.disabled) return;
    isOpen.value = !isOpen.value;

    if (isOpen.value) {
        nextTick(() => {
            searchInputRef.value?.focus();
        });
    }
};

const closeDropdown = () => {
    isOpen.value = false;
    searchQuery.value = '';
};

const selectItem = (item: SelectItem) => {
    emit('update:modelValue', item.nombre);
    emit('change', item);
    closeDropdown();
};

const selectFirstFiltered = () => {
    const firstItem = filteredItems.value[0];
    if (firstItem) {
        selectItem(firstItem);
    }
};

// Cerrar al hacer clic fuera
const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
        closeDropdown();
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

// Reset búsqueda cuando se cierra
watch(isOpen, (newVal) => {
    if (!newVal) {
        searchQuery.value = '';
    }
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
}
</style>
