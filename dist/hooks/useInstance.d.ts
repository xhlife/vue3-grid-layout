export default function useCurrentInstance(): {
    proxy: import("vue").ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}>, {}, {}> | null;
    appContext: import("vue").AppContext;
    globalProperties: import("vue").ComponentCustomProperties & Record<string, any>;
};
