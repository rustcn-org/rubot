interface PointsLevel {
    level: number;
    points: number;
    icon: string;
    title: string;
}

interface MemoData {
    pointsLevel: PointsLevel[];
}

const memoData: MemoData = {
    pointsLevel: [
        {
            level: 1,
            points: 10,
            icon: "🌟",
            title: "预备成员I",
        },
        {
            level: 2,
            points: 100,
            icon: "🌟🌟",
            title: "预备成员II",
        },
        {
            level: 3,
            points: 200,
            icon: "🌟🌟🌟",
            title: "预备成员III",
        },
        {
            level: 4,
            points: 400,
            icon: "💎",
            title: "正式成员I",
        },
        {
            level: 5,
            points: 800,
            icon: "💎💎",
            title: "正式成员II",
        },
        {
            level: 6,
            points: 2000,
            icon: "💎💎💎",
            title: "正式成员III",
        },
        {
            level: 7,
            points: 4000,
            icon: "🔮",
            title: "王牌成员I",
        },
        {
            level: 8,
            points: 8000,
            icon: "🔮🔮",
            title: "王牌成员II",
        },
        {
            level: 9,
            points: 16000,
            icon: "🔮🔮🔮",
            title: "王牌成员III",
        },
        {
            level: 10,
            points: 50000,
            icon: "👑",
            title: "最强王者",
        },
    ],
};

export function getLevel() {
    return memoData.pointsLevel;
}

async function fetchLevel() {
    const resp = await fetch(
        "https://raw.githubusercontent.com/rustlang-cn/Rustt/main/.github/points-level.json"
    );
    const table: PointsLevel[] = await resp.json();
    memoData.pointsLevel = table;
}

export async function startTask() {
    await fetchLevel();
    setInterval(async () => {
        await fetchLevel();
    }, 1000 * 60 * 60 * 3);
}
