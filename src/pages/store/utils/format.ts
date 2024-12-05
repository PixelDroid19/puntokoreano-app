type group = {
    name: string;
    description: string;
    image: string;
    subgroups: subgroups[]
}

type subgroups = {
    name: string;
}

export const formartSubGroups = (group: group) => {
    return group.subgroups.map((subgroup, idx) => ({ label: subgroup.name, key: idx}));
}