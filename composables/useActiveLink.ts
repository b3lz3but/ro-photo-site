import { computed } from "vue";
import { useRoute } from "#imports";

const normalizePath = (path: string) => {
  if (!path) {
    return "/";
  }

  const trimmed = path.replace(/\/+$/, "");

  return trimmed === "" ? "/" : trimmed;
};

export const useActiveLink = () => {
  const route = useRoute();
  const currentPath = computed(() => normalizePath(route.path));

  const isActive = (to: string) => {
    const target = normalizePath(to);

    if (target === "/") {
      return currentPath.value === "/";
    }

    return (
      currentPath.value === target ||
      currentPath.value.startsWith(`${target}/`)
    );
  };

  return {
    isActive,
  };
};
